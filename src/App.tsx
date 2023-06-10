import React, { useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { v4 as uuid } from 'uuid';
import html2canvas from 'html2canvas';

interface TextBox {
  id: string;
  x: number;
  y: number;
  text: string;
  fontSize: number;
  color: string;
}

const textBoxStyle = {
  position: "relative" as "relative",
};

const removeButtonStyle = {
  position: "absolute" as "absolute",
  top: -20,
  left: -20,
};

const backgroundImageOptions = [
  { id: "1", name: "Background 1", url: "/images/image1.png" },
  { id: "2", name: "Background 2", url: "/images/image2.png" },
  // Add more background options here
];

const App: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [textBoxes, setTextBoxes] = useState<TextBox[]>([]);
  const [selectedTextBoxId, setSelectedTextBoxId] = useState<string | null>(null);


  const handleDrag = (e: any, ui: any, id: string) => {
    const { x, y } = ui;
    setTextBoxes(prevTextBoxes =>
      prevTextBoxes.map(tb =>
        tb.id === id ? { ...tb, x, y } : tb
      )
    );
  };

  const addTextBox = () => {
    const id = uuid();
    setTextBoxes(prevTextBoxes => [...prevTextBoxes, { id, x: 0, y: 0, text: 'テキストを入力します', fontSize: 20, color: '#000000' }]);
  };

  const removeTextBox = (id: string) => {
    setTextBoxes(prevTextBoxes => prevTextBoxes.filter(tb => tb.id !== id));
  };

  const downloadImage = async () => {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current as HTMLElement);
    const imgData = canvas.toDataURL();
    const link = document.createElement('a');
    link.href = imgData;
    link.download = 'card.png';
    link.click();
  };

  return (
    <div>
      <select
        onChange={(e) => {
          const selectedOption = backgroundImageOptions.find(option => option.id === e.target.value);
          setBackgroundImage(selectedOption ? selectedOption.url : null);
        }}
      >
        <option value="">Select a background</option>
        {backgroundImageOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
      <button onClick={addTextBox}>Add Text Box</button>
      <button onClick={downloadImage}>Download Card</button>
      <div>
        <input
          type="number"
          value={textBoxes.find(tb => tb.id === selectedTextBoxId)?.fontSize || 20}
          onChange={e => {
            const fontSize = Number(e.target.value);
            setTextBoxes(prevTextBoxes =>
              prevTextBoxes.map(tb =>
                tb.id === selectedTextBoxId ? { ...tb, fontSize } : tb
              )
            );
          }}
        />
        <input
          type="color"
          value={textBoxes.find(tb => tb.id === selectedTextBoxId)?.color || '#000000'}
          onChange={e => {
            const color = e.target.value;
            setTextBoxes(prevTextBoxes =>
              prevTextBoxes.map(tb =>
                tb.id === selectedTextBoxId ? { ...tb, color } : tb
              )
            );
          }}
        />
      </div>
      <div ref={cardRef} style={{ width: '500px', height: '700px', backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' }}>
        {textBoxes.map(textBox => (
          <Draggable
            key={textBox.id}
            defaultPosition={{ x: textBox.x, y: textBox.y }}
            onStop={(e, ui) => handleDrag(e, ui, textBox.id)}
          >
            <div
              style={textBoxStyle}
              onClick={() => setSelectedTextBoxId(textBox.id)}
            >
              <Draggable
                key={textBox.id}
                defaultPosition={{ x: textBox.x, y: textBox.y }}
                onStop={(e, ui) => handleDrag(e, ui, textBox.id)}
              >
                <div
                  className="draggable-textbox"
                  style={textBoxStyle}
                  onClick={() => setSelectedTextBoxId(textBox.id)}
                >
                  <button className="remove-btn" style={{ ...removeButtonStyle}} onClick={() => removeTextBox(textBox.id)}>X</button>
                  <textarea
                    value={textBox.text}
                    style={{ background: 'transparent', border: 'none', fontSize: `${textBox.fontSize}px`, color: textBox.color }}
                    onChange={e =>
                      setTextBoxes(prevTextBoxes =>
                        prevTextBoxes.map(tb =>
                          tb.id === textBox.id ? { ...tb, text: e.target.value } : tb
                        )
                      )
                    }
                  />
                </div>
              </Draggable>
            </div>
          </Draggable>
        ))}
      </div>
    </div>
  );
};

export default App;
