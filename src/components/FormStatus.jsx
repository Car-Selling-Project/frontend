const FormStatus = ({ loading, successMessage, errorMessage }) => {
    if (loading) {
      return (
        <p className="text-blue-500 text-sm mb-4 text-center animate-pulse">
          Processing...
        </p>
      );
    }
  
    if (successMessage) {
      return (
        <p className="text-green-500 text-sm mb-4 text-center">
          {successMessage}
        </p>
      );
    }
  
    if (errorMessage) {
      return (
        <p className="text-red-500 text-sm mb-4 text-left">
          {errorMessage}
        </p>
      );
    }
  
    return null;
  };
  
  export default FormStatus;