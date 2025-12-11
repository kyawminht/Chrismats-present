import { GREETINGS } from "./config/greetings";

export function setDynamicTitle() {
  const path = window.location.pathname; // /gift-for/boss
  const parts = path.split("/");

  const nameId = parts[2]; // "boss"

  const found = GREETINGS.find((g) => g.id === nameId);

  if (found) {
       document.title = `This is for you, ${found.recipient}`;
  } else {
    document.title = "X-Mats Gift";
  }
}
