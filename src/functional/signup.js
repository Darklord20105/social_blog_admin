import React from "react";
import Button from "@material-ui/core/Button";

const SignUp = props => {
  return (
    <div>
      <h1>Sign Up and create an account</h1>
      <Button
        color="primary"
        size="large"
        variant="contained"
        onClick={() => props.auth.login()}
      >
        Signup
      </Button>
    </div>
  );
};

export default SignUp;
