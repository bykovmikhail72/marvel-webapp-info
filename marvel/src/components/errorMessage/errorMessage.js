import img from "./error.gif"

import "./errorMessage.scss";

const ErrorMessage = () => {

    return (
        <img src={img} alt="error" className="error-img"/>
    )
}

export default ErrorMessage;