import "./loader.css";

export const Loader = () => (
  <div className="loader">
    <div className="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <div>
      <h1>Loading...</h1>
    </div>
  </div>
);
