type Props = {
  currentQuestion: any;
};

const TextField = ({ currentQuestion }: Props) => {
  const { properties } = currentQuestion;

  return (
    <>
      <textarea
        style={{ width: "200px", resize: "none", minHeight: "35px" }}
        rows={properties?.allowMultiline ? 5 : 3}
      />
    </>
  );
};
export default TextField;
