function validateProduct(data) {
  const errors = [];

  if (!data || typeof data !== "object") {
    return ["Request body must be a JSON object."];
  }

  if (typeof data.name !== "string" || data.name.trim() === "") {
    errors.push("name is required and must be a non-empty string.");
  }

  if (typeof data.price !== "number" || Number.isNaN(data.price)) {
    errors.push("price is required and must be a number.");
  } else if (data.price < 0) {
    errors.push("price must be greater than or equal to 0.");
  }

  if (typeof data.categoryId !== "number") {
    errors.push("categoryId is required and must be a number.");
  }

  return errors;
}

function validateCategory(data) {
  const errors = [];

  if (!data || typeof data !== "object") {
    return ["Request body must be a JSON object."];
  }

  if (typeof data.name !== "string" || data.name.trim() === "") {
    errors.push("name is required and must be a non-empty string.");
  }

  return errors;
}

function validateLogin(data) {
  const errors = [];
  if (!data || typeof data !== "object") {
    return ["Request body must be a JSON object."];
  }
  if (typeof data.email !== "string" || data.email.trim() === "") {
    errors.push("email is required and must be a non-empty string.");
  }
  if (typeof data.password !== "string" || data.password.trim() === "") {
    errors.push("password is required and must be a non-empty string.");
  }
  return errors;
}

module.exports = { validateProduct, validateCategory, validateLogin };
