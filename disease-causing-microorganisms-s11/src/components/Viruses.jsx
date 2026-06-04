import React from "react";
import "./Viruses.css";

function Viruses() {

  const diseases = [
    {
      name: "COVID-19",
      cause: "Coronavirus (SARS-CoV-2)",
      symptoms: [
        "Fever",
        "Cough",
        "Breathing difficulty",
        "Loss of taste or smell"
      ],
      prevention: [
        "Vaccination",
        "Wash hands regularly",
        "Wear mask when needed"
      ]
    },

    {
      name: "Dengue",
      cause: "Dengue virus spread by mosquitoes",
      symptoms: [
        "High fever",
        "Joint pain",
        "Headache",
        "Skin rashes"
      ],
      prevention: [
        "Avoid stagnant water",
        "Use mosquito nets",
        "Keep surroundings clean"
      ]
    },

    {
      name: "Flu",
      cause: "Influenza Virus",
      symptoms: [
        "Fever",
        "Runny nose",
        "Body pains",
        "Tiredness"
      ],
      prevention: [
        "Flu vaccine",
        "Maintain hygiene",
        "Avoid contact with sick people"
      ]
    },

    {
      name: "AIDS",
      cause: "Human Immunodeficiency Virus (HIV)",
      symptoms: [
        "Weak immunity",
        "Weight loss",
        "Frequent infections",
        "Fatigue"
      ],
      prevention: [
        "Safe medical practices",
        "Avoid sharing needles",
        "Health checkups"
      ]
    }
  ];


  return (

    <div className="virus-page">

      <h1>🦠 Viruses and Human Health</h1>


      <div className="definition-card">

        <h2>What are Viruses?</h2>

        <p>
          Viruses are tiny infectious microorganisms
          that cannot reproduce on their own.
          They enter living cells and multiply,
          causing different diseases in humans,
          animals, and plants.
        </p>

      </div>



      <h2>Common Viral Diseases</h2>


      <div className="disease-container">

        {
          diseases.map((disease,index)=>(

            <div className="disease-card" key={index}>

              <h2>{disease.name}</h2>

              <h3>Cause</h3>
              <p>{disease.cause}</p>


              <h3>Symptoms</h3>

              <ul>
                {
                  disease.symptoms.map((item,i)=>(
                    <li key={i}>{item}</li>
                  ))
                }
              </ul>



              <h3>Prevention</h3>

              <ul>
                {
                  disease.prevention.map((item,i)=>(
                    <li key={i}>{item}</li>
                  ))
                }

              </ul>

            </div>

          ))
        }

      </div>


    </div>
  );
}


export default Viruses;