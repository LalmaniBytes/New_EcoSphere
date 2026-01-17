import React from "react";

const About = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold mb-6">About EcoSphere</h1>

      <p className="text-lg mb-6">
        <strong>EcoSphere</strong> is a civic-tech driven sustainability platform
        focused on empowering communities through data, awareness, and collective action.
      </p>

      <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
      <p className="mb-6">
        To enable individuals and communities to make informed, data-driven decisions
        that contribute to cleaner and more sustainable environments.
      </p>

      <h2 className="text-2xl font-semibold mb-3">What We Do</h2>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li>Environmental data analysis and visualization</li>
        <li>Evaluation of civic technology platforms</li>
        <li>Community engagement and sustainability awareness</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-3">Our Vision</h2>
      <p>
        We envision cities where data-informed citizens actively collaborate
        to create cleaner, healthier, and more resilient environments.
      </p>
    </div>
  );
};

export default About;
