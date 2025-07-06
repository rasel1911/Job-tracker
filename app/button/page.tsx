"use client";
// Demo component to showcase different variations
import React, { useState } from "react";
import Neon3DButton from "@/components/design/neonbutton"; // Adjust

const NeonButtonDemo = () => {
  const [clickCount, setClickCount] = useState(0);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-8 p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">3D Neon Buttons</h1>
        <p className="text-gray-400">Hover and click to see the effects</p>
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        <Neon3DButton
          color="cyan"
          size="small"
          onClick={() => setClickCount((prev) => prev + 1)}
        >
          Small Cyan
        </Neon3DButton>

        <Neon3DButton
          color="purple"
          size="medium"
          onClick={() => setClickCount((prev) => prev + 1)}
        >
          Medium Purple
        </Neon3DButton>

        <Neon3DButton
          color="green"
          size="large"
          onClick={() => setClickCount((prev) => prev + 1)}
        >
          Large Green
        </Neon3DButton>

        <Neon3DButton
          color="pink"
          size="medium"
          onClick={() => setClickCount((prev) => prev + 1)}
        >
          Pink Neon
        </Neon3DButton>
      </div>

      <div className="flex gap-4 mt-8">
        <Neon3DButton
          color="cyan"
          size="small"
          onClick={() => setClickCount(0)}
        >
          Reset Counter
        </Neon3DButton>

        <Neon3DButton color="purple" size="small" disabled={true}>
          Disabled Button
        </Neon3DButton>
      </div>

      <div className="text-center mt-8">
        <p className="text-white text-xl">
          Button clicks:{" "}
          <span className="text-cyan-400 font-bold">{clickCount}</span>
        </p>
      </div>

      <div className="mt-8 text-center text-gray-400 text-sm max-w-md">
        <p>
          Features: 3D depth, neon glow effects, hover animations, press
          feedback, multiple colors and sizes, disabled state
        </p>
      </div>
    </div>
  );
};

export default NeonButtonDemo;
