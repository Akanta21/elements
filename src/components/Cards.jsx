import React, {useState} from 'react';
import 'elt-react-credit-cards/es/styles-compiled.css'
import ReactCreditCard from 'elt-react-credit-cards';
import base64 from 'base-64';
import './cards.css'
import { apiUrl } from './config';
import {
    formatCreditCardNumber,
    formatCVC,
    formatExpirationDate
  } from "../utils/payment";


export const Cards = ({apiKey, amount, currency}) => {
    const [cardState, setCardState] = useState({
        cvc: '',
        expiry: '',
        focus: '',
        name: '',
        number: '',
      })

      const [data, setData] = useState({})

      const handleCallback = ({ issuer }, isValid) => {
        if (isValid) {
            setCardState({ ...cardState, issuer });
        }
      };

      const handleInputFocus = (e) => {
        setCardState({ ...cardState, focus: e.target.name });
      }
      
      const handleInputChange = ({target}) => {

        if (target.name === "number") {
            target.value = formatCreditCardNumber(target.value);
          } else if (target.name === "expiry") {
            target.value = formatExpirationDate(target.value);
          } else if (target.name === "cvc") {
            target.value = formatCVC(target.value);
          }
        
        setCardState({ ...cardState, [target.name]: target.value });
      }
      
      const handleSubmit = async (e) => {
        console.log('i am here')
        e.preventDefault();
        const formData = [...e.target.elements]
            .filter(d => d.name)
            .reduce((acc, d) => {
                acc[d.name] = d.value;
                return acc;
            }, {});

        const [month, year] = formData.expiry.split('/')    

        const mappedData = {
          amount: parseInt(amount),
          currency,
          card_cvn: formData.cvc,
          card_data: {
            account_number: formData.number.replace(/\s+/g, ''),
            cvn: formData.cvc,
            exp_month: month,
            exp_year: "20" + year
          },
          is_single_use: true,
          should_authenticate: false
        }

        // const bytes = utf8.encode(apiKey);
        const encoded = base64.encode(apiKey + ':');


        let response = await fetch(apiUrl, 
          {
            method:'POST', 
            headers: {
              'Authorization': 'Basic ' + encoded,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(mappedData)
          }
        );
        let data = await response.json();    

        setData(data)
        console.log(data)
      }

    return (
        <div className="card-payment">
          <ReactCreditCard
            cvc={cardState.cvc}
            expiry={cardState.expiry}
            focused={cardState.focus}
            name={cardState.name}
            number={cardState.number}
            callback={handleCallback}
          />
          <form className="card-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="tel"
                name="number"
                className="form-control"
                placeholder="Card Number"
                pattern="[\d| ]{16,22}"
                required
                onChange={handleInputChange}
                onFocus={handleInputFocus}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Name"
                required
                onChange={handleInputChange}
                onFocus={handleInputFocus}
              />
            </div>
            <div className="row">
              <div className="col-6">
                <input
                  type="tel"
                  name="expiry"
                  className="form-control"
                  placeholder="Valid Thru"
                  pattern="\d\d/\d\d"
                  required
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                />
              </div>
              <div className="col-6">
                <input
                  type="tel"
                  name="cvc"
                  className="form-control"
                  placeholder="CVC"
                  pattern="\d{3,4}"
                  required
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                />
              </div>
            </div>
            <input type="hidden" name="issuer" value={cardState.issuer} />
            <div className="form-actions">
              <button className="btn btn-primary btn-block">PAY</button>
            </div>
            <div>{JSON.stringify(data)}</div>
          </form>
        </div>
    )
}
