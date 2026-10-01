import type { FillBlankQuestion, OrderingQuestion, PracticeExam, Question } from "../types";

export function normalizeText(value: string) {
  return value.trim().toLocaleLowerCase("vi-VN").replace(/\s+/g, " ");
}

export function getCorrectAnswerValue(question: Question) {
  if (question.type === "multiple-choice" || question.type === "listening") {
    return question.correctChoiceId;
  }

  if (question.type === "ordering") {
    return question.correctOrder.join("");
  }

  return normalizeText(question.correctText);
}

export function isQuestionAnswered(question: Question, answer?: string) {
  if (!answer) {
    return false;
  }

  return question.type === "fill-blank" ? answer.trim().length > 0 : answer.length > 0;
}

export function isQuestionCorrect(question: Question, answer?: string) {
  if (!isQuestionAnswered(question, answer)) {
    return false;
  }

  if (question.type === "fill-blank") {
    const normalizedAnswer = normalizeText(answer ?? "");
    const accepted = [question.correctText, ...(question.acceptedAnswers ?? [])].map(normalizeText);
    return accepted.includes(normalizedAnswer);
  }

  return answer === getCorrectAnswerValue(question);
}

export function getAnswerLabel(question: Question, answer?: string) {
  if (!isQuestionAnswered(question, answer)) {
    return "Chưa chọn";
  }

  if (question.type === "multiple-choice" || question.type === "listening") {
    return question.choices.find((choice) => choice.id === answer)?.text ?? answer ?? "";
  }

  if (question.type === "ordering") {
    return getOrderingText(question, answer ?? "");
  }

  return answer ?? "";
}

export function getCorrectAnswerLabel(question: Question) {
  if (question.type === "multiple-choice" || question.type === "listening") {
    return question.choices.find((choice) => choice.id === question.correctChoiceId)?.text ?? "";
  }

  if (question.type === "ordering") {
    return getOrderingText(question, question.correctOrder.join(""));
  }

  return question.correctText;
}

export function getOrderingText(question: OrderingQuestion, orderValue: string) {
  return orderValue
    .split("")
    .map((id) => question.fragments.find((fragment) => fragment.id === id)?.text ?? id)
    .join(" ");
}

export function playListeningQuestion(question: Question) {
  if (question.type !== "listening") {
    return;
  }

  if (question.audioSrc) {
    void new Audio(question.audioSrc).play();
    return;
  }

  if (question.audioText && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(question.audioText);
    utterance.lang = "ja-JP";
    utterance.rate = 0.82;
    window.speechSynthesis.speak(utterance);
  }
}

export function getQuestionTypeLabel(question: Question) {
  if (question.type === "multiple-choice") {
    return "Trắc nghiệm";
  }

  if (question.type === "listening") {
    return "Nghe hiểu";
  }

  if (question.type === "ordering") {
    return "Sắp xếp từ";
  }

  return "Điền ô trống";
}
