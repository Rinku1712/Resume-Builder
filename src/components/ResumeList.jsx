const buttonStyle = {
  padding: '8px 12px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '13px',
};

export default function ResumeList({ resumes, onAdd, onRead, onUpdate, onDelete }) {
  return (
    <section>
      <div
        className="resume-list-grid"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '24px',
        }}
      >
        <div>
          <h2 style={{ margin: '0 0 6px' }}>My Resumes</h2>
          <p style={{ margin: 0, color: '#666' }}>Create and manage your resumes.</p>
        </div>

        <button
          onClick={onAdd}
          style={{
            ...buttonStyle,
            padding: '12px 16px',
            background: '#172033',
            color: '#fff',
          }}
        >
          + Add New Resume
        </button>
      </div>

      {resumes.length === 0 ? (
        <div
          className="resume-card-actions"
          style={{
            background: '#fff',
            borderRadius: '10px',
            padding: '40px 20px',
            textAlign: 'center',
            border: '1px dashed #cbd5e1',
          }}
        >
          <h3>No resumes yet</h3>
          <p style={{ color: '#666' }}>Create your first resume to get started.</p>

          <button
            onClick={onAdd}
            style={{
              ...buttonStyle,
              background: '#172033',
              color: '#fff',
            }}
          >
            Create Resume
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '18px',
          }}
        >
          {resumes.map((resume) => {
            const accentColor = /^#[0-9A-Fa-f]{6}$/.test(resume.themeColor || '')
              ? resume.themeColor
              : '#D4A017';

            return (
              <article
                key={resume.id}
                style={{
                  background: '#fff',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                }}
              >
                <div
                  style={{
                    height: '8px',
                    background: accentColor,
                  }}
                />

                <div style={{ padding: '18px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <h3 style={{ margin: '0 0 8px', overflowWrap: 'anywhere' }}>
                      {resume.title || 'Untitled Resume'}
                    </h3>

                    <span
                      title={`Accent color: ${accentColor}`}
                      style={{
                        width: '20px',
                        height: '20px',
                        flexShrink: 0,
                        borderRadius: '50%',
                        background: accentColor,
                        border: '1px solid #ccc',
                      }}
                    />
                  </div>

                  <p style={{ margin: '4px 0', color: '#555' }}>
                    {resume.fullName || 'Name not added'}
                  </p>

                  <p style={{ margin: '4px 0 16px', color: '#777', fontSize: '13px' }}>
                    {(resume.customSections || []).length} custom section(s)
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      gap: '8px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <button
                      onClick={() => onRead(resume)}
                      style={{
                        ...buttonStyle,
                        background: '#e0f2fe',
                        color: '#075985',
                      }}
                    >
                      Read
                    </button>

                    <button
                      onClick={() => onUpdate(resume)}
                      style={{
                        ...buttonStyle,
                        background: '#dcfce7',
                        color: '#166534',
                      }}
                    >
                      Update
                    </button>

                    <button
                      onClick={() => onDelete(resume.id)}
                      style={{
                        ...buttonStyle,
                        background: '#fee2e2',
                        color: '#991b1b',
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
