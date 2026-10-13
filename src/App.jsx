import { useEffect, useRef, useState } from 'react';
import html2pdf from 'html2pdf.js';

import ResumeForm from './components/ResumeForm';
import ResumePreview from './components/ResumePreview';
import ResumeList from './components/ResumeList';

const createEmptyResume = () => ({
  id: crypto.randomUUID(),
  title: 'My Resume',
  fullName: '',
  email: '',
  phone: '',
  address: '',
  summary: '',
  education: '',
  experience: '',
  skills: '',
  themeColor: '#D4A017',
  customSections: [],
});

const containerStyle = {
  fontFamily: 'Arial, sans-serif',
  minHeight: '100vh',
  background: '#f3f4f6',
  color: '#222',
};

const buttonStyle = {
  padding: '10px 16px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold',
};

export default function App() {
  const [resumes, setResumes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('resumes')) || [];
    } catch {
      return [];
    }
  });

  const [page, setPage] = useState('list');
  const [selectedResume, setSelectedResume] = useState(createEmptyResume);
  const [editingId, setEditingId] = useState(null);

  const previewRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('resumes', JSON.stringify(resumes));
  }, [resumes]);

  function openNewResume() {
    setSelectedResume(createEmptyResume());
    setEditingId(null);
    setPage('editor');
  }

  function loadResume(resume) {
    setSelectedResume({
      ...createEmptyResume(),
      ...resume,
      customSections: resume.customSections || [],
      themeColor: resume.themeColor || '#D4A017',
    });
  }

  function readResume(resume) {
    loadResume(resume);
    setEditingId(null);
    setPage('reader');
  }

  function editResume(resume) {
    loadResume(resume);
    setEditingId(resume.id);
    setPage('editor');
  }

  function saveResume() {
    if (!selectedResume.fullName.trim()) {
      alert('Please enter your full name.');
      return;
    }

    if (editingId) {
      setResumes((previous) =>
        previous.map((resume) => (resume.id === editingId ? { ...selectedResume } : resume)),
      );
    } else {
      setResumes((previous) => [...previous, { ...selectedResume, id: crypto.randomUUID() }]);
    }

    setPage('list');
    setEditingId(null);
  }

  function deleteResume(id) {
    const confirmed = window.confirm('Are you sure you want to delete this resume?');

    if (!confirmed) return;

    setResumes((previous) => previous.filter((resume) => resume.id !== id));
  }

  function cancelEditor() {
    setPage('list');
    setEditingId(null);
  }

  function downloadPDF() {
    if (!previewRef.current) return;

    const options = {
      margin: 8,
      filename: `${selectedResume.fullName || 'resume'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
      },
    };

    html2pdf().set(options).from(previewRef.current).save();
  }

  function printResume() {
    window.print();
  }

  return (
    <div style={containerStyle}>
      <header
        style={{
          background: '#172033',
          color: '#fff',
          padding: '18px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '24px' }}>Resume Builder</h1>

        {page !== 'list' && (
          <button
            style={{
              ...buttonStyle,
              background: '#fff',
              color: '#172033',
            }}
            onClick={cancelEditor}
          >
            My Resumes
          </button>
        )}
      </header>

      <main style={{ padding: '24px' }}>
        {page === 'list' ? (
          <ResumeList
            resumes={resumes}
            onAdd={openNewResume}
            onRead={readResume}
            onUpdate={editResume}
            onDelete={deleteResume}
          />
        ) : page === 'reader' ? (
          <section aria-label="Read resume">
            <h2 style={{ marginTop: 0 }}>Reading Resume</h2>
            <div style={{ maxWidth: '850px', margin: '0 auto' }}>
              <ResumePreview resume={selectedResume} />
            </div>
          </section>
        ) : (
          <>
            <div
              className="editor-layout"
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
                gap: '24px',
                alignItems: 'start',
              }}
            >
              <ResumeForm
                key={editingId || 'new-resume'}
                resume={selectedResume}
                onChange={setSelectedResume}
                onSave={saveResume}
                onCancel={cancelEditor}
              />

              <div>
                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                    flexWrap: 'wrap',
                    marginBottom: '16px',
                  }}
                >
                  <button
                    style={{
                      ...buttonStyle,
                      background: '#172033',
                      color: '#fff',
                    }}
                    onClick={downloadPDF}
                  >
                    Download PDF
                  </button>

                  <button
                    style={{
                      ...buttonStyle,
                      background: '#fff',
                      border: '1px solid #ccc',
                    }}
                    onClick={printResume}
                  >
                    Print Resume
                  </button>
                </div>

                <div ref={previewRef}>
                  <ResumePreview resume={selectedResume} />
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <style>{`
        @media (max-width: 900px) {
          .editor-layout {
            grid-template-columns: minmax(0, 1fr) !important;
          }
        }

        @media print {
          body {
            background: white !important;
          }

          body * {
            visibility: hidden;
          }

          .resume-preview,
          .resume-preview * {
            visibility: visible;
          }

          .resume-preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}
