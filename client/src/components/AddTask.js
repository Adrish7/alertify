import { useState } from "react";
import React from "react";
import { FaRegListAlt,FaRegCalendarAlt } from "react-icons/fa";
import moment from "moment";
import { db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import { useSelectedProjectValue } from "../context";


export const AddTask = ({showAddTaskMain = true, shouldShowMain = false, showQuickAddTask, setShowQuickAddTask}) => <p>AddTask</p>