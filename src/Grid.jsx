const Grid = ({ props }) => {
  const { setSelection, i, player } = props;
  const handleClick = () => {
    if (i.player === "") {
      setSelection(i.id);
    } else return;
  };
  return (
    <div onClick={handleClick} className="grid">
      {player[i.player]}
    </div>
  );
};

export default Grid;
