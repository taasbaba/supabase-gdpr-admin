import { Link } from "react-router-dom";

const VerifyPendingPage = () => {
  return (
    <div className="vh-100 d-flex justify-content-center align-items-center bg-primary text-white">
      <div className="text-center">
        <h3> Please check your email</h3>
        <p>A verification link has been sent to your inbox.</p>
        <Link to="/" className="btn btn-light mt-3">
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default VerifyPendingPage;
