import { render } from "@testing-library/react";
import axios from "axios";
import React, { useEffect } from "react";
import { act } from "react-dom/test-utils";
import VotingDetailUser from "./pages/VotingDetail";

beforeEach(() => {
    
})

it("Must render",async () => {
    const fakeVoting = {
        title: "Votación de ejemplo",
        description: "¿Qué tipo de música quieres escuchar?",
        openingHour: "26-03-2021 00:00:00",
        closingHour: "01-07-2021 23:59:00",
        timer: null,
        votersUsernames : []
    }
    new MockAdapter(axios)
})