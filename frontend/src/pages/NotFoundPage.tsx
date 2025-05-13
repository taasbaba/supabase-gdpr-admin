const NotFoundPage = () => {
  return (
    <div className="vh-100 d-flex justify-content-center align-items-center bg-light text-center">
      <div>
        <h1 className="display-4 fw-bold text-danger">404</h1>
        <p className="lead">Page not found</p>
        <a href="/" className="btn btn-primary mt-3">
          Go to Home
        </a>
      </div>
    </div>
  );
};

export default NotFoundPage;
