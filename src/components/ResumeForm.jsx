import { useState } from 'react';
import ReactQuill from 'react-quill-new';

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '10px',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  fontSize: '14px',
  marginTop: '6px',
};

const fieldStyle = {
  marginBottom: '16px',
};

const labelStyle = {
  display: 'block',
  fontWeight: 'bold',
  fontSize: '14px',
};

const editorModules = {
  toolbar: [['bold', 'italic', 'underline'], [{ list: 'ordered' }, { list: 'bullet' }], ['clean']],
};

export default function ResumeForm({ resume, onChange = () => {}, onSave, onCancel }) {
  const [newSection, setNewSection] = useState(null);

  function updateForm(field, value) {
    onChange({
      ...resume,
      [field]: value,
    });
  }

  function addSection() {
    setNewSection({
      id: crypto.randomUUID(),
      title: '',
      content: '',
    });
  }

  function saveNewSection() {
    if (!newSection.title.trim()) {
      alert('Please enter a title for the new section.');
      return;
    }

    updateForm('customSections', [
      ...(resume.customSections || []),
      { ...newSection, title: newSection.title.trim() },
    ]);
    setNewSection(null);
  }

  function updateCustomSection(id, field, value) {
    const updatedSections = (resume.customSections || []).map((section) =>
      section.id === id ? { ...section, [field]: value } : section,
    );

    updateForm('customSections', updatedSections);
  }

  function removeSection(id) {
    const updatedSections = (resume.customSections || []).filter((section) => section.id !== id);

    updateForm('customSections', updatedSections);
  }

  function renderTextEditor(label, field, placeholder) {
    return (
      <div style={fieldStyle}>
        <label style={labelStyle}>{label}</label>

        <div style={{ marginTop: '8px' }}>
          <ReactQuill
            theme="snow"
            value={resume[field] || ''}
            onChange={(value) => updateForm(field, value)}
            modules={editorModules}
            placeholder={placeholder}
          />
        </div>
      </div>
    );
  }

  return (
    <section
      className="resume-form"
      style={{
        background: '#fff',
        padding: '22px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
      }}
    >
      <h2 style={{ marginTop: 0 }}>Edit Your Resume</h2>

      <div style={fieldStyle}>
        <label style={labelStyle}>Resume Title</label>
        <input
          style={inputStyle}
          value={resume.title || ''}
          onChange={(e) => updateForm('title', e.target.value)}
          placeholder="e.g. Frontend Developer Resume"
        />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Full Name *</label>
        <input
          style={inputStyle}
          value={resume.fullName || ''}
          onChange={(e) => updateForm('fullName', e.target.value)}
          placeholder="Enter your full name"
        />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Email</label>
        <input
          type="email"
          style={inputStyle}
          value={resume.email || ''}
          onChange={(e) => updateForm('email', e.target.value)}
          placeholder="you@example.com"
        />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Phone</label>
        <input
          style={inputStyle}
          value={resume.phone || ''}
          onChange={(e) => updateForm('phone', e.target.value)}
          placeholder="Enter your phone number"
        />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Address</label>
        <input
          style={inputStyle}
          value={resume.address || ''}
          onChange={(e) => updateForm('address', e.target.value)}
          placeholder="City, State"
        />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Resume Accent Color</label>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginTop: '8px',
          }}
        >
          <input
            type="color"
            value={resume.themeColor || '#D4A017'}
            onChange={(e) => updateForm('themeColor', e.target.value)}
            aria-label="Choose resume accent color"
            style={{
              width: '60px',
              height: '42px',
              padding: '2px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              background: '#fff',
              cursor: 'pointer',
            }}
          />

          <input
            style={{ ...inputStyle, width: '130px', marginTop: 0 }}
            value={resume.themeColor || '#D4A017'}
            onChange={(e) => {
              const value = e.target.value;

              if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
                updateForm('themeColor', value);
              } else {
                onChange({ ...resume, themeColor: value });
              }
            }}
            placeholder="#D4A017"
            maxLength={7}
          />

          <span
            style={{
              display: 'inline-block',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: /^#[0-9A-Fa-f]{6}$/.test(resume.themeColor || '')
                ? resume.themeColor
                : '#D4A017',
              border: '1px solid #ccc',
              flexShrink: 0,
            }}
          />
        </div>

        <small style={{ color: '#666', display: 'block', marginTop: '6px' }}>
          Choose any color or enter its HEX code. The preview updates instantly.
        </small>
      </div>

      {renderTextEditor('Professional Summary', 'summary', 'Write a short professional summary...')}

      {renderTextEditor(
        'Education',
        'education',
        'Add your degree, institution, and graduation year...',
      )}

      {renderTextEditor(
        'Work Experience',
        'experience',
        'Add your roles, responsibilities, and achievements...',
      )}

      {renderTextEditor('Skills', 'skills', 'Add your technical and professional skills...')}

      <hr style={{ margin: '26px 0', border: 0, borderTop: '1px solid #ddd' }} />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '10px',
          flexWrap: 'wrap',
        }}
      >
        <h3 style={{ margin: 0 }}>Custom Sections</h3>

        <button
          type="button"
          onClick={addSection}
          disabled={Boolean(newSection)}
          style={{
            padding: '9px 13px',
            background: '#e8efff',
            color: '#1d4ed8',
            border: 'none',
            borderRadius: '6px',
            cursor: newSection ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            opacity: newSection ? 0.6 : 1,
          }}
        >
          + Add Section
        </button>
      </div>

      {(resume.customSections || []).map((section) => (
        <div
          key={section.id}
          style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '14px',
            marginTop: '16px',
          }}
        >
          <div style={fieldStyle}>
            <label style={labelStyle}>Section Title</label>

            <input
              style={inputStyle}
              value={section.title || ''}
              onChange={(e) => updateCustomSection(section.id, 'title', e.target.value)}
              placeholder="e.g. Projects, Certifications, Languages"
            />
          </div>

          <label style={labelStyle}>Section Content</label>

          <div style={{ marginTop: '8px', marginBottom: '16px' }}>
            <ReactQuill
              theme="snow"
              value={section.content || ''}
              onChange={(value) => updateCustomSection(section.id, 'content', value)}
              modules={editorModules}
              placeholder="Write your section content..."
            />
          </div>

          <button
            type="button"
            onClick={() => removeSection(section.id)}
            style={{
              padding: '8px 12px',
              background: '#fee2e2',
              color: '#b91c1c',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Remove Section
          </button>
        </div>
      ))}

      {newSection && (
        <div
          style={{
            border: '1px solid #93c5fd',
            borderRadius: '8px',
            padding: '14px',
            marginTop: '16px',
            background: '#f8fbff',
          }}
        >
          <div style={fieldStyle}>
            <label style={labelStyle}>New Section Title</label>
            <input
              style={inputStyle}
              value={newSection.title}
              onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
              placeholder="e.g. Projects, Certifications, Languages"
            />
          </div>

          <label style={labelStyle}>Section Content</label>
          <div style={{ marginTop: '8px', marginBottom: '16px' }}>
            <ReactQuill
              theme="snow"
              value={newSection.content}
              onChange={(value) => setNewSection({ ...newSection, content: value })}
              modules={editorModules}
              placeholder="Write your section content..."
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={saveNewSection}
              style={{
                padding: '8px 12px',
                background: '#dcfce7',
                color: '#166534',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              Save Section
            </button>
            <button
              type="button"
              onClick={() => setNewSection(null)}
              style={{
                padding: '8px 12px',
                background: '#e5e7eb',
                color: '#222',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          gap: '10px',
          marginTop: '26px',
          flexWrap: 'wrap',
        }}
      >
        <button
          type="button"
          onClick={onSave}
          style={{
            padding: '12px 18px',
            background: '#172033',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Save Resume
        </button>

        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: '12px 18px',
            background: '#e5e7eb',
            color: '#222',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      </div>
    </section>
  );
}
