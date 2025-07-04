import { render, screen, fireEvent } from "@testing-library/react";
import BatchForm from "./BatchForm";
import React from "react";

test("submits correct batch data", () => {
  const mockSubmit = jest.fn();

  render(<BatchForm onSubmit={mockSubmit} />);

  fireEvent.change(screen.getByPlaceholderText(/batch id/i), { target: { value: "batch001" } });
  fireEvent.change(screen.getByPlaceholderText(/batch name/i), { target: { value: "MedicineA" } });

  fireEvent.click(screen.getByText(/submit/i));

  expect(mockSubmit).toHaveBeenCalledWith({
    id: "batch001",
    name: "MedicineA",
  });
});

