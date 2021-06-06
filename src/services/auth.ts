import { v4 as uuid } from "uuid";

type SignInRequestData = {
  email: string;
  password: string;
};

const delay = (amount = 750) =>
  new Promise((resolve) => setTimeout(resolve, amount));

export async function signInRequest(data: SignInRequestData) {
  await delay();

  return {
    token: uuid(),

    user: {
      name: "Hemerson Oliveira",
      email: "example@gmail.com",
      avatar_url: "https://www.github.com/hemerson-git.png",
    },
  };
}

export async function recoverUserInformation(token: string) {
  await delay();

  console.log(token);

  return {
    user: {
      name: "Hemerson Oliveira",
      email: "example@gmail.com",
      avatar_url: "https://www.github.com/hemerson-git.png",
    },
  };
}
