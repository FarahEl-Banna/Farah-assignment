import { useEffect, useState } from 'react'
import { createWorker } from 'tesseract.js';
import nationalitiesList from './nationalities.json';
import Lable from './Lable';

import './App.css'


function App() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [textResult, setTextResult] = useState("")
  const [loading, setLoading] = useState(false)
  const [parsedData, setParsedData] = useState({});

  const foundNationalities = (text)=>nationalitiesList.filter(nationality => 
    text.toLowerCase().includes(nationality.toLowerCase())
  );
  
  const convertImageToText = async() =>{
    const worker = await createWorker('eng+ara');
    const {data:{text}} = await worker.recognize(selectedImage)
    console.log(text)
    setTextResult(text)
    parseData(text);
    setLoading(false)
  }

  useEffect(()=>{
    if(selectedImage){
      convertImageToText()
    }
    setLoading(textResult?false:true)
  },[selectedImage])

  const handleChangeImage = e=>{
    setTextResult("")
    setLoading(false)
    setSelectedImage(e.target.files[0])

  }
  const parseData = (text) => {
    const cleanedText = text.replace(/\s+/g, ' ').trim(); // Remove extra spaces
    const docType = identifyDocumentType(cleanedText);
    const Nationality = foundNationalities(cleanedText)||'Not found';

    // Define patterns for various fields
    const patterns = {
      name: /(?:Name|الاسم)\s*([^\n]*)/i,
      idNumber: /(\d{3}-\d{4}-\d{7}-\d{1}|\d{7,8})/g,
      //nationality: /(?:Nationality|الجنسشية)\s*([^\n]*)/i,
    };

    const labels = { documentType: docType };
    // Extract data based on patterns
    Object.entries(patterns).forEach(([key, pattern]) => {
      const match = text.match(pattern);
      labels[key] = match ? (match[1] || match[2] || match[0]) : 'Not found';
    });
    labels['nationality']= Nationality;

    setParsedData(labels);
  };

  const identifyDocumentType = (text) => {
    if (text.match(/Identity Card|بطاقة هوية/i)) {
      return 'Identity Card';
    } else if (text.match(/Driving License|رخصة قيادة/i)) {
      return 'Driving License';
    } else if (text.match(/Student|بطاقة طالب/i)) {
      return 'Student ID';
    } else {
      return 'Unknown Document Type';
    }
  };
 

  return (
    <div className='App'>
      <h1>ID Data Extraction</h1>
      <div className='input-wrapper'>
        <label htmlFor='upload'>Upload Image</label>
        <input id='upload' type='file' accept='image/*' onChange={handleChangeImage}></input>
      </div>
      <div className='result'>
        {selectedImage && <div className='box-image'>
          <img src={URL.createObjectURL(selectedImage)} alt='thumb'/>
          </div>}
          {loading && selectedImage && <p>Loading...</p>}
          {textResult && <div className='box-p'>
            <div>
              <h3>Extracted Data:</h3>
                {Object.entries(parsedData).map(([key, value]) => (
                  <Lable key={key} label={key} value={value}></Lable>
                ))}
            </div>
          </div>}
      </div>
    </div>
  )
}

export default App
