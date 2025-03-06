import LoginForm from "../../components/LoginForm.js";

export default function LoginPage() {
    return (
        <div className="login-container">
            <h2>로그인</h2>
            <LoginForm />
            <p>
                계정이 없나요? <a href="/auth/signup">회원가입</a>
            </p>
        </div>
    );
}
