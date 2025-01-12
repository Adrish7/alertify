import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import { Checkbox } from "../components/Checkbox";
import { screen } from "@testing-library/dom";
import { db } from "../firebase";
import { getFirestore, collection, doc, updateDoc } from "firebase/firestore";




jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn(),
  updateDoc: jest.fn(() => Promise.resolve("Update success")),
}));

describe("<Checkbox />", () => {
  describe("Success", () => {
    it('renders the task checkbox', () => {
      const { queryByTestId } = render(<Checkbox id="1" taskDesc="Finish this tutorial series!" />);
      expect (queryByTestId('checkbox-action')).toBeTruthy();
    });
  });
})
