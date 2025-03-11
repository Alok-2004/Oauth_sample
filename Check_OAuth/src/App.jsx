import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import axios from "axios";

export default function App() {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      const fullname = [user.firstName, user.lastName].filter(Boolean).join(" ");

      axios.post("http://localhost:5000/api/users", {
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        fullname,
        avatar: user.imageUrl,
      })
      .then(response => {
        console.log("User saved:", response.data);
      })
      .catch(error => {
        console.error("Error saving user:", error);
      });
    }
  }, [user]);

  return (
    <header>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  );
}
