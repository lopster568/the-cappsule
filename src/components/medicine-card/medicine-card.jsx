import { useState, useEffect } from "react";
import "./medicine-card.css";

const MedicineCard = ({ forms, details, salt }) => {
  // Initial data values for Medicine Card
  const [form, setForm] = useState(forms[0]);
  const [strength, setStrength] = useState(Object.keys(details[forms[0]])[0]);
  const [packaging, setPackaging] = useState(
    Object.keys(details[forms[0]][Object.keys(details[forms[0]])[0]])[0]
  );

  // Price of the medicine
  const [price, setPrice] = useState(null);

  // States to manage to show more options
  const [showAllForms, setShowAllForms] = useState(false);
  const [showAllStrengths, setShowAllStrengths] = useState(false);
  const [showAllPackagings, setShowAllPackagings] = useState(false);

  const isUnavailable = () => {
    const packagingDetails = details[form][strength][packaging];
    return (
      packagingDetails &&
      Object.values(packagingDetails).every((value) => value === null)
    );
  };

  // Update price based on selected form, strength and packaging
  useEffect(() => {
    let minPrice = Number.MAX_SAFE_INTEGER;
    if (
      details[form] &&
      details[form][strength] &&
      details[form][strength][packaging]
    ) {
      Object.keys(details[form][strength][packaging]).forEach((pharmacyId) => {
        const medicine_list = details[form][strength][packaging][pharmacyId];
        if (medicine_list) {
          medicine_list.forEach((medicine) => {
            console.log(medicine.selling_price);
            if (medicine.selling_price < minPrice) {
              minPrice = medicine.selling_price;
            }
          });
        }
      });
    }

    if (minPrice !== Number.MAX_SAFE_INTEGER) {
      setPrice(minPrice);
    } else {
      setPrice(null);
    }
  }, [form, strength, packaging, details]);

  const MedicineOptions = () => {
    return (
      <div className="actions-container">
        <div className="medicine-options">
          <p className="poppins-light option-title">Form: </p>
          <div className="option-actions">
            {forms.slice(0, showAllForms ? forms.length : 2).map((medform) => (
              <button
                key={medform}
                className={`option-btn ${
                  medform === form ? "option-btn-selected" : ""
                }
                ${isUnavailable() ? "option-btn-unavailable" : ""}
                    `}
                onClick={() => {
                  setForm(medform);
                  setStrength(Object.keys(details[medform])[0]);
                  setPackaging(
                    Object.keys(
                      details[medform][Object.keys(details[medform])[0]]
                    )[0]
                  );
                }}
              >
                {medform}
              </button>
            ))}
            {!showAllForms && forms.length > 2 && (
              <button
                className="show-more-btn"
                onClick={() => setShowAllForms(true)}
              >
                Show More
              </button>
            )}
          </div>
        </div>
        <div className="medicine-options">
          <p className="poppins-light">Strength: </p>
          <div className="option-actions">
            {Object.keys(details[form])
              ?.slice(0, showAllStrengths ? strength.length : 2)
              ?.map((medStrength) => (
                <button
                  key={medStrength}
                  className={`option-btn ${
                    medStrength === strength ? "option-btn-selected" : ""
                  }  `}
                  onClick={() => {
                    setStrength(medStrength);
                    setPackaging(Object.keys(details[form][medStrength])[0]);
                  }}
                >
                  {medStrength}
                </button>
              ))}
            {!showAllStrengths && Object.keys(details[form]).length > 2 && (
              <button
                className="show-more-btn"
                onClick={() => setShowAllStrengths(true)}
              >
                Show More
              </button>
            )}
          </div>
        </div>
        <div className="medicine-options">
          <p className="poppins-light">Packaging: </p>
          <div className="option-actions">
            {Object.keys(details[form][strength])
              ?.slice(0, showAllPackagings ? packaging.length : 2)
              ?.map((pack) => (
                <button
                  key={pack}
                  className={`option-btn ${
                    pack === packaging ? "option-btn-selected" : ""
                  }  ${
                    isUnavailable(form, strength, pack)
                      ? "option-btn-unavailable"
                      : ""
                  }`}
                  onClick={() => setPackaging(pack)}
                >
                  {pack}
                </button>
              ))}
            {!showAllPackagings &&
              Object.keys(details[form][strength]).length > 2 && (
                <button
                  className="show-more-btn"
                  onClick={() => setShowAllPackagings(true)}
                >
                  Show More
                </button>
              )}
          </div>
        </div>
      </div>
    );
  };

  const MedicinePrice = () => {
    if (price === null)
      return (
        <div className="poppins-regular unavailable">
          No stores selling this product near your
        </div>
      );
    return <div className="medicine-price poppins-bold ">From₹{price}</div>;
  };

  const MedicineSalt = () => {
    return (
      <div className="medicine-info">
        <h3 className="poppins-semibold">{salt}</h3>
        <p className="poppins-regular" style={{ fontSize: "14px" }}>
          {`${form} | ${strength} | ${packaging}`}
        </p>
      </div>
    );
  };

  return (
    <div className="medicine-card-container">
      <div className="medicine-card-content">
        <MedicineOptions />
        <MedicineSalt />
        <MedicinePrice />
      </div>
    </div>
  );
};

export default MedicineCard;
