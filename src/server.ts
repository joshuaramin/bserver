import express from "express";

const port = process.env.PORT ?? 4000;
const app = express();

//import all routes
import Student from "./routes/student/index";
import IdentityCard from "./routes/identity_card/index";
import College from "./routes/college/index";

//end of import route

app.use(express.json());
app.use("/api/v1/college", College);
app.use("/api/v1/identity_card", IdentityCard);
app.use("/api/v1/student", Student);

app.listen(port, () => {
  console.log(`Server is listening to port http://localhost:${port}`);
});
