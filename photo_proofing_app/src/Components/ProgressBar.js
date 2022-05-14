const ProgressBar = ({ percentage }) => {
  return (
    <div className="progressBarDiv">
      <div className="progressBar">
        <span>{percentage}%</span>
        <div className="progress" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};

export default ProgressBar;
