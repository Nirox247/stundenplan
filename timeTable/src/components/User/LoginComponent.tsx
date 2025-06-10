import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  ProviderId,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";  // neu
import ColorPalets from "../ColorPalets";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
 
function LoginComponent() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);

  const auth = getAuth();
  const db = getFirestore();  // neu
  const navigate = useNavigate();


   
    const [ipapiData, setIpapiData] = useState<any>({});
    const [ipifyData, setIpifyData] = useState<any>({});
    useEffect(() => {
      const fetchIPs = async () => {
        const [ipapi, ipify] = await Promise.all([
          fetch("https://ipapi.co/json/").then(res => res.json()).catch(() => ({})),
          fetch("https://api.ipify.org?format=json").then(res => res.json()).catch(() => ({})),
        ]);
        setIpapiData(ipapi);
        setIpifyData(ipify);
      };
      fetchIPs();
    }, []);

   
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setIsLoading(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        name: user.displayName || name,
        role: "user",
        Info: {
          ip: ipifyData.ip,
          city: ipapiData.city,
          region: ipapiData.region,
          country: ipapiData.country_name,
        },
      });
    } catch (err: any) {
      setError(err.message || "Fehler beim Login");
    } finally {
      setIsLoading(false);
    }
  };

  const CreateUserAccount = async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);

    if (!name || !email || !password) {
      setError("Bitte füllen Sie alle Felder aus.");
      setIsError(true);
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Firestore-Dokument mit Rolle und Name anlegen (Standardrolle: user)
              await setDoc(doc(db, "users", user.uid), {
        email,
        name,
        role: "user",
        Info: {
          ip: ipifyData.ip,
          ipv6: ipapiData.ip,
          city: ipapiData.city,
          region: ipapiData.region,
          country: ipapiData.country_name,
        },
      });


      setName("");
      setEmail("");
      setPassword("");
      setError("Account erfolgreich erstellt!");
    } catch (e: any) {
      setError(e.message || "Fehler bei der Registrierung.");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    setIsLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Bitte E-Mail und Passwort eingeben.");
      setIsLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (e: any) {
      setError(e.message || "Fehler beim Login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    console.log(ipapiData, ipifyData),
    <div
      className="flex flex-col items-center justify-center p-8 rounded-lg shadow-xl max-w-sm mx-auto my-12"
      style={{ backgroundColor: ColorPalets.primaryLight}}
    >
      <h2
        className="text-2xl font-semibold mb-6"
        style={{ color: ColorPalets.textPrimary }}
      >
        Willkommen zurück!
      </h2>

      <button
        onClick={handleGoogleLogin}
        className={`w-full py-3 px-4 rounded-full font-bold shadow-md transition-all duration-300 flex items-center justify-center gap-2 ${
          isLoading ? "opacity-70 cursor-not-allowed" : ""
        }`}
        disabled={isLoading}
        style={{
          backgroundColor: ColorPalets.primaryLighter,
          color: ColorPalets.textPrimary,
        }}
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google Logo"
          className="w-5 h-5 mr-2"
        />
        Mit Google anmelden
      </button>

      {error && (
        <div
          style={{ color: ColorPalets.danger }}
          className="text-sm mt-4 text-center"
        >
          {error}
        </div>
      )}

      <div className="relative w-full my-8">
        <div className="absolute inset-0 flex items-center">
          <div
            className="w-full border-t opacity-20"
            style={{ borderColor: ColorPalets.textPrimary }}
          ></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span
            className="px-3 pt-10"
            style={{
              color: ColorPalets.textPrimary,
            }}
          >
            Oder mit E-Mail
          </span>
        </div>
      </div>

      <p
        className="text-lg mb-4 font-medium"
        style={{ color: ColorPalets.textPrimary }}
      >
        Neuen Account erstellen
      </p>

      <input
        type="text"
        placeholder="Dein Name"
        className="w-full p-3 rounded-md border mb-3 shadow-sm focus:outline-none focus:ring-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          backgroundColor: ColorPalets.backgroundLight,
          color: ColorPalets.textPrimary,
          borderColor: ColorPalets.primaryLight,
          outlineColor: ColorPalets.primary,
        }}
      />
      <input
        type="email"
        placeholder="E-Mail"
        className="w-full p-3 rounded-md border mb-3 shadow-sm focus:outline-none focus:ring-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          backgroundColor: ColorPalets.backgroundLight,
          color: ColorPalets.textPrimary,
          borderColor: ColorPalets.primaryLight,
          outlineColor: ColorPalets.primary,
        }}
      />
      <input
        type="password"
        placeholder="Passwort"
        className="w-full p-3 rounded-md border mb-5 shadow-sm focus:outline-none focus:ring-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          backgroundColor: ColorPalets.backgroundLight,
          color: ColorPalets.textPrimary,
          borderColor: ColorPalets.primaryLight,
          outlineColor: ColorPalets.primary,
        }}
      />
      <button
        onClick={CreateUserAccount}
        disabled={isLoading}
        className={`w-full py-3 px-4 rounded-full font-bold shadow-md transition-all duration-300 ${
          isLoading ? "opacity-70 cursor-not-allowed" : ""
        }`}
        style={{
          backgroundColor: ColorPalets.primaryDark,
          color: ColorPalets.white,
        }}
      >
        {isLoading ? "Lädt..." : "Registrieren"}
      </button>

      <div className="relative w-full my-8">
        <div className="absolute inset-0 flex items-center">
          <div
            className="w-full border-t opacity-20"
            style={{ borderColor: ColorPalets.textPrimary }}
          ></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span
            className="pt-10 px-3"
            style={{
              color: ColorPalets.textPrimary,
            }}
          >
            Schon registriert?
          </span>
        </div>
      </div>

      <button
        onClick={handleEmailLogin}
        disabled={isLoading}
        className={`w-full py-3 px-4 rounded-full font-bold shadow-md transition-all duration-300 ${
          isLoading ? "opacity-70 cursor-not-allowed" : ""
        }`}
        style={{
          backgroundColor: ColorPalets.success,
          color: ColorPalets.textPrimary,
        }}
      >
        Login
      </button>

      {isError && !error && (
        <div
          className="text-sm mt-4 text-center"
          style={{ color: ColorPalets.danger }}
        >
          Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.
        </div>
      )}
    </div>
  );
}

export default LoginComponent;
