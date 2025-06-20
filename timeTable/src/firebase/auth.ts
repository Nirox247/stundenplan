import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export const registerWithEmail = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;

  // Lege Rolle 'user' im Firestore an
  await setDoc(doc(db, "users", uid), {
    role: "user",
    email: email,
    createdAt: new Date(),
  });

  return userCredential;
};
