import { redirect } from "next/navigation";
import { CreateUserIfNull } from "./actions";

const AuthCallbackPage = async () => {
  const { success } = await CreateUserIfNull();
  if (!success) {
    return <div>Something went wrong</div>;
  }

  redirect("/");
};

export default AuthCallbackPage;
