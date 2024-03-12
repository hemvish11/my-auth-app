import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth"
import { app } from "../firebase";
import { signInSuccess } from "../redux/user/userSlice.js"

function OAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleGoogleCilck = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            const result = await signInWithPopup(auth, provider);
            console.log(result);
            const res = await fetch("/api/auth/google", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL
                })
            });

            const data = await res.json();
            console.log(data);
            dispatch(signInSuccess(data));
            navigate("/");

        } catch (error) {
            console.log("Could not login with google", error);
        }
    }
    return (
        <button
            type="button"
            onClick={handleGoogleCilck}
            className="bg-red-700 text-white rounded-lg p-3
            uppercase hover:opacity-90"
        >Continue with google
        </button>
    )
}

export default OAuth