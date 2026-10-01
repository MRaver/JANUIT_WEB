import type { FillBlankQuestion, OrderingQuestion, Question } from "../../types";

type QuestionAnswerProps = {
  answer: string;
  onUpdateAnswer: (answer: string) => void;
  question: Question;
};

export function QuestionAnswer({ answer, onUpdateAnswer, question }: QuestionAnswerProps) {
  if (question.type === "multiple-choice" || question.type === "listening") {
    return (
      <div className="choice-list">
        {question.choices.map((choice) => {
          const checked = answer === choice.id;

          return (
            <button
              className={checked ? "choice-button selected" : "choice-button"}
              key={choice.id}
              onClick={() => onUpdateAnswer(choice.id)}
              type="button"
            >
              <span>{choice.id.toUpperCase()}</span>
              <strong>{choice.text}</strong>
            </button>
          );
        })}
      </div>
    );
  }

  if (question.type === "ordering") {
    return <OrderingAnswer answer={answer} onUpdateAnswer={onUpdateAnswer} question={question} />;
  }

  return <FillBlankAnswer answer={answer} onUpdateAnswer={onUpdateAnswer} question={question} />;
}

type OrderingAnswerProps = {
  answer: string;
  onUpdateAnswer: (answer: string) => void;
  question: OrderingQuestion;
};

export function OrderingAnswer({ answer, onUpdateAnswer, question }: OrderingAnswerProps) {
  const selectedIds = answer.split("").filter(Boolean);
  const availableFragments = question.fragments.filter((fragment) => !selectedIds.includes(fragment.id));

  function addFragment(id: string) {
    if (selectedIds.length < question.fragments.length && !selectedIds.includes(id)) {
      onUpdateAnswer(`${answer}${id}`);
    }
  }

  function removeFragmentAt(index: number) {
    const nextIds = selectedIds.filter((_, selectedIndex) => selectedIndex !== index);
    onUpdateAnswer(nextIds.join(""));
  }

  return (
    <div className="ordering-area">
      <div className="ordering-slots" aria-label="Các ô đã xếp">
        {question.fragments.map((_, index) => {
          const selectedId = selectedIds[index];
          const selectedText = question.fragments.find((fragment) => fragment.id === selectedId)?.text;

          return (
            <button
              aria-label={selectedText ? `Bỏ ${selectedText} khỏi đáp án` : `Ô trống ${index + 1}`}
              className={selectedText ? "ordering-slot filled" : "ordering-slot"}
              disabled={!selectedText}
              key={index}
              onClick={() => removeFragmentAt(index)}
              type="button"
            >
              {selectedText ?? index + 1}
            </button>
          );
        })}
      </div>

      <div className="fragment-list">
        {availableFragments.map((fragment) => (
          <button className="fragment-button" key={fragment.id} onClick={() => addFragment(fragment.id)} type="button">
            <span>{fragment.id.toUpperCase()}</span>
            <strong>{fragment.text}</strong>
          </button>
        ))}
      </div>
    </div>
  );
}

type FillBlankAnswerProps = {
  answer: string;
  onUpdateAnswer: (answer: string) => void;
  question: FillBlankQuestion;
};

export function FillBlankAnswer({ answer, onUpdateAnswer, question }: FillBlankAnswerProps) {
  return (
    <label className="fill-answer">
      <span>Nhập đáp án</span>
      <input
        autoComplete="off"
        inputMode="text"
        onChange={(event) => onUpdateAnswer(event.target.value)}
        placeholder={question.placeholder ?? "Nhập câu trả lời"}
        type="text"
        value={answer}
      />
    </label>
  );
}
