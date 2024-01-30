import { API_URL } from "./index.js";
import fetchData from "./tools/fetchData.js";

class User {
  constructor() {}
  #id = 0;

  async register(bodyInput) {
    const url = `${API_URL}/register`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: bodyInput,
    };
    const data = await fetchData(url, options);
    if (!data) {
      return;
    }
    return data;
  }

  async login(bodyInput) {
    const url = `${API_URL}/login`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: bodyInput,
    };
    const data = await fetchData(url, options);
    if (!data) {
      return;
    }
    this.#setUserID(data);
    return data;
  }

  async checkBalance() {
    const url = `${API_URL}/balance/${this.#id}`;
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const data = await fetchData(url, options);
    if (!data) {
      return;
    }
    return data.data.balance;
  }

  #setUserID(data) {
    this.#id = data.id;
  }

  async debit(debitAmount) {
    const url = `${API_URL}/transactions`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          amount: -debitAmount,
          userId: this.#id,
        },
      }),
    };
    const data = await fetchData(url, options);
    if (!data) {
      return;
    }
    return data;
  }
  async credit(creditAmount) {
    let data = await this.debit(-creditAmount);
    if (!data) {
      return;
    }
    return data;
  }

  async getMutation(mutationOptions) {
    mutationOptions = mutationOptions.split(" ");

    const filterType = mutationOptions[0];
    const sortType = mutationOptions[1];
    const url = `${API_URL}/mutation/${
      this.#id
    }?sort=${sortType}&filter=${filterType}`;
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const data = await fetchData(url, options);
    if (!data) {
      return;
    }
    return data;
  }
}

export default User;
