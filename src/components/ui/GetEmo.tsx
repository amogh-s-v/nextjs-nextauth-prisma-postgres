"use client"

import React from "react";
import { Button } from "@mui/material";

const GetEmo = () => {
  return (
    <Button onClick={async()=>{
        const res = await fetch("/api/emotion", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            journalEntry: `
            Today was quite challenging. I woke up with a splitting headache, which lingered throughout the day despite taking painkillers. The stress from work deadlines exacerbated my headache, and I found it difficult to concentrate on my tasks. Additionally, I experienced back pain in my lower back, likely due to sitting at my desk for long hours without proper posture.
Despite these physical ailments, I managed to complete most of my work assignments. However, the persistent back pain made it challenging to find a comfortable sitting position, further adding to my frustration and distraction.
By midday, I decided to take a short break and stretch to alleviate some of the tension in my back. While it provided temporary relief, the back pain returned later in the afternoon, reminding me of the importance of incorporating regular exercise and proper ergonomics into my daily routine.
Despite the setbacks, I remained determined to stay productive and focused on completing my tasks. However, by the end of the day, I felt mentally drained and physically exhausted. My lack of energy made it difficult to engage in my usual evening activities, and I opted to rest and unwind instead.
Reflecting on the day, I realize the importance of prioritizing self-care and taking proactive measures to address back pain and other physical discomforts. Tomorrow, I plan to incorporate more frequent breaks and ergonomic adjustments to prevent further back pain and improve my overall well-being.
Overall, today served as a valuable lesson in listening to my body's signals and making conscious efforts to prioritize my health amidst the demands of daily life.
            `,
          }),
        });
      }}>Get Emo</Button>
  );
};

export default GetEmo;
