import pool from "../api/db/index.js";
import bcrypt from "bcrypt";

export const createUser = async (name, email, password, age) => {
  try {
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query =
      "INSERT INTO users (name, email, password, age) VALUES ($1, $2, $3, $4) RETURNING id, name, email, age";
    const values = [name, email, hashedPassword, age];

    const result = await pool.query(query, values);
    return {
      success: true,
      data: result.rows[0],
    };
  } catch (err) {
    console.log("Error creating user:", err);
    return {
      success: false,
      error: err,
    };
  }
};

export const findUserByEmail = async (email) => {
  try {
    const query = "SELECT * FROM users WHERE email = $1";
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      return {
        success: false,
        error: new Error("User not found"),
      };
    }

    return {
      success: true,
      data: result.rows[0],
    };
  } catch (err) {
    console.log("Error finding user by email:", err);
    return {
      success: false,
      error: err,
    };
  }
};

export const findUserById = async (id) => {
  try {
    const query = "SELECT id, name, email, age FROM users WHERE id = $1";
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return {
        success: false,
        error: new Error("User not found"),
      };
    }

    return {
      success: true,
      data: result.rows[0],
    };
  } catch (err) {
    console.log("Error finding user by id:", err);
    return {
      success: false,
      error: err,
    };
  }
};

export const findOrCreateSocialUser = async (profile) => {
  try {
    // First, try to find the user by social provider ID
    const findQuery =
      "SELECT * FROM users WHERE social_provider = $1 AND social_id = $2";
    const findResult = await pool.query(findQuery, [
      profile.provider,
      profile.id,
    ]);

    if (findResult.rows.length > 0) {
      return {
        success: true,
        data: findResult.rows[0],
      };
    }

    // If not found, create a new user
    const createQuery = `
      INSERT INTO users (name, email, social_provider, social_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email
    `;

    const values = [
      profile.displayName || "User",
      profile.emails && profile.emails[0] ? profile.emails[0].value : null,
      profile.provider,
      profile.id,
    ];

    const createResult = await pool.query(createQuery, values);

    return {
      success: true,
      data: createResult.rows[0],
    };
  } catch (err) {
    console.log("Error finding or creating social user:", err);
    return {
      success: false,
      error: err,
    };
  }
};
