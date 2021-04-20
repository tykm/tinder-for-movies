import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";
import Genres from "./Genres";
import Movies from "./Movies";
test("check submit button disappears on Genres page", () => {
  render(<Genres genreList = {['Action', 'Adventure', 'History', 'Horror', 'Animation', 'Comedy', 'Crime', 'Drama', 'Family', 'Fantasy']} />);
  const submitButtonElement = screen.getByRole("button", { name: "Submit" });
  expect(submitButtonElement).toBeInTheDocument();
  fireEvent.click(submitButtonElement);
  expect(submitButtonElement).not.toBeInTheDocument();
});

test("check submit button disappears on Movie page", () => {
  render(<Movies />);
  const submitButtonElement = screen.getByRole("button", { name: "Submit" });
  expect(submitButtonElement).toBeInTheDocument();
  fireEvent.click(submitButtonElement);
  expect(submitButtonElement).not.toBeInTheDocument();
});