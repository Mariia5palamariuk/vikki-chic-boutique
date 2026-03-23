class Auth {
  static API_AUTH_URL =
    "https://r211anoshk.execute-api.eu-north-1.amazonaws.com/vikki-chic-boutique-api/auth";

  // ----- LOGIN -----
  static async login(email, password) {
    console.log("Login attempt:", { email, password });

    try {
      const response = await fetch(`${this.API_AUTH_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log("Login response status:", response.status);

      const data = await response.json();

      console.log("Login response data:", data);

      if (!response.ok) {
        console.warn("Login FAILED:", data);
        return data;
      }

      if (data.token) {
        console.log("Login SUCCESS → saving token and user");

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        console.log("Saved token:", data.token);
        console.log("Saved user:", data.user);

        return data;
      }

      return { message: "Токен не отримано" };
    } catch (error) {
      console.error("Login ERROR:", error);
      return { message: "Помилка мережі або сервера" };
    }
  }

  // ----- SIGNUP -----
  static async signup(email, password) {
    const name = email.split("@")[0];
    console.log("Signup attempt:", { name, email, password });

    try {
      const response = await fetch(`${this.API_AUTH_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      console.log("Signup response status:", response.status);

      const data = await response.json();

      console.log("Signup response data:", data);

      return data;
    } catch (error) {
      console.error("Signup ERROR:", error);
      return { message: "Помилка реєстрації" };
    }
  }

  // ----- RESTORE PASSWORD -----
  static async restorePassword(email) {
    console.log("Restore password attempt:", email);

    try {
      const response = await fetch(`${this.API_AUTH_URL}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      console.log("Restore response status:", response.status);

      const data = await response.json();

      console.log("Restore response data:", data);

      return data;
    } catch (error) {
      console.error("Restore ERROR:", error);
      return { message: "Помилка відновлення пароля" };
    }
  }

  // ----- TOKEN -----
  static getToken() {
    const token = localStorage.getItem("token");
    console.log("Get token:", token);
    return token;
  }

  // ----- USER -----
  static getUser() {
    const user = localStorage.getItem("user");

    if (!user) {
      console.log("Get user: null");
      return null;
    }

    const parsedUser = JSON.parse(user);
    console.log("Get user:", parsedUser);
    return parsedUser;
  }

  static isAuthenticated() {
    const isAuth = !!this.getToken();
    console.log("Is authenticated:", isAuth);
    return isAuth;
  }

  // ----- AUTH HEADER -----
  static getAuthHeaders() {
    const token = this.getToken();

    if (!token) {
      return {
        "Content-Type": "application/json",
      };
    }

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  // ----- LOGOUT -----
  static logout() {
    console.log("Logout → removing token and user");

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    console.log("User logged out");
  }
}
