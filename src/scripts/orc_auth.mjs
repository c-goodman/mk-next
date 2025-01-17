import bcrypt from "bcrypt";

// const bcrypt = require("bcrypt");
import "../../envConfig.mjs";

const orc = process.env.VERIFIED_USER_PASSWORD;

async function salted_orc() {
  if (orc) {
    const a = await bcrypt.hash(orc, 10);
    console.log(a);
    const b = await bcrypt.compare(orc, a);
    if (b) {
      console.log("Approved!");
    }
  }
}

salted_orc();
