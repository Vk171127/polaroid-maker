const Button = () => {
  const btnHandle = () => {
    console.log("Button clicked");
  };

  return (
    <div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded"
        onClick={btnHandle}
      >
        Button
      </button>
    </div>
  );
};

export default Button;
