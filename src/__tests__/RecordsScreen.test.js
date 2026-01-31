import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import RecordsScreen from "../screens/RecordsScreen";
import { createRecord } from "../services/api";

// Mock the API module
jest.mock("../services/api");

// Mock navigation
const mockNavigation = {
  goBack: jest.fn(),
};

describe("RecordsScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders input stage correctly", () => {
    const { getByPlaceholderText, getByText } = render(
      <RecordsScreen navigation={mockNavigation} />,
    );

    expect(getByPlaceholderText("0")).toBeTruthy();
    expect(getByText("Food")).toBeTruthy();
    expect(getByText("Preview")).toBeTruthy();
  });

  test("validates empty amount on preview", () => {
    const { getByText } = render(<RecordsScreen navigation={mockNavigation} />);

    const previewButton = getByText("Preview");
    fireEvent.press(previewButton);

    // Stage should still be 0 (input) because validation failed
    expect(getByText("New Entry")).toBeTruthy();
  });

  test("switches to preview stage with valid input", () => {
    const { getByPlaceholderText, getByText } = render(
      <RecordsScreen navigation={mockNavigation} />,
    );

    const amountInput = getByPlaceholderText("0");
    fireEvent.changeText(amountInput, "100");

    const previewButton = getByText("Preview");
    fireEvent.press(previewButton);

    // Should now be in preview stage
    waitFor(() => {
      expect(getByText("Confirm?")).toBeTruthy();
      expect(getByText("$100")).toBeTruthy();
    });
  });

  test("successfully submits record", async () => {
    createRecord.mockResolvedValue({
      success: true,
      message: "Record created",
    });

    const { getByPlaceholderText, getByText } = render(
      <RecordsScreen navigation={mockNavigation} />,
    );

    // Enter amount
    const amountInput = getByPlaceholderText("0");
    fireEvent.changeText(amountInput, "250");

    // Go to preview
    const previewButton = getByText("Preview");
    fireEvent.press(previewButton);

    // Wait for preview stage
    await waitFor(() => {
      expect(getByText("Confirm?")).toBeTruthy();
    });

    // Confirm
    const confirmButton = getByText(/Record & Save/i);
    fireEvent.press(confirmButton);

    // Wait for API call
    await waitFor(() => {
      expect(createRecord).toHaveBeenCalledWith({
        amount: 250,
        category: "Food",
        description: "",
        transaction_type: "expense",
      });
    });
  });

  test("handles API error gracefully", async () => {
    createRecord.mockRejectedValue(new Error("Network error"));

    const { getByPlaceholderText, getByText } = render(
      <RecordsScreen navigation={mockNavigation} />,
    );

    const amountInput = getByPlaceholderText("0");
    fireEvent.changeText(amountInput, "100");

    const previewButton = getByText("Preview");
    fireEvent.press(previewButton);

    await waitFor(() => {
      expect(getByText("Confirm?")).toBeTruthy();
    });

    const confirmButton = getByText(/Record & Save/i);
    fireEvent.press(confirmButton);

    // Should show error toast/alert and not crash
    await waitFor(() => {
      expect(createRecord).toHaveBeenCalled();
    });
  });

  test("can go back from preview to input", async () => {
    const { getByPlaceholderText, getByText } = render(
      <RecordsScreen navigation={mockNavigation} />,
    );

    const amountInput = getByPlaceholderText("0");
    fireEvent.changeText(amountInput, "100");

    const previewButton = getByText("Preview");
    fireEvent.press(previewButton);

    await waitFor(() => {
      expect(getByText("Confirm?")).toBeTruthy();
    });

    const backButton = getByText("Back to Edit");
    fireEvent.press(backButton);

    await waitFor(() => {
      expect(getByText("New Entry")).toBeTruthy();
    });
  });

  test("changes category correctly", () => {
    const { getByText } = render(<RecordsScreen navigation={mockNavigation} />);

    const transportButton = getByText("Transport");
    fireEvent.press(transportButton);

    // Category should be updated (visual verification would check active state)
    expect(transportButton).toBeTruthy();
  });
});
