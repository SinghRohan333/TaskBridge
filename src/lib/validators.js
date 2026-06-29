export function validateName(name) {
  if (!name || name.trim().length === 0) return "Name is required.";
  return null;
}

export function validateEmail(email) {
  if (!email || email.trim().length === 0) return "Email is required.";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Enter a valid email address.";
  return null;
}

export function validatePassword(password) {
  if (!password) return "Password is required.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(password))
    return "Password must include at least one uppercase letter.";
  if (!/[a-z]/.test(password))
    return "Password must include at least one lowercase letter.";
  return null;
}

export function validateImageUrl(url) {
  if (!url) return null; // optional field
  try {
    new URL(url);
    return null;
  } catch {
    return "Enter a valid image URL.";
  }
}

export function validateRole(role) {
  if (!role || !["client", "freelancer"].includes(role)) {
    return "Please select a role.";
  }
  return null;
}
