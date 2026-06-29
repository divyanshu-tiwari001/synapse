import { createClient } from '@/lib/supabase/server'
import { UploadZone } from '@/components/upload/UploadZone'
import { FileText, Clock } from 'lucide-react'

export default async function UploadPage() {
  const supabase = await createClient()
  const { data: subjects } = await supabase.from('subjects').select('*').order('name')
  const { data: documents } = await supabase
    .from('documents')
    .select('*, subjects(name)')
    .order('created_at', { ascending: false })
    .limit(20)

  const defaultSubjectId = subjects?.[0]?.id || ''

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-white">Upload Documents</h2>
        <p className="text-sm text-gray-400 mt-1">
          Upload your PDFs to make them searchable with AI chat
        </p>
      </div>

      {subjects && subjects.length > 0 ? (
        <UploadZone subjectId={defaultSubjectId} />
      ) : (
        <div className="rounded-xl backdrop-blur-md bg-white/5 border border-white/10 p-8 text-center">
          <p className="text-gray-400">No subjects found. Add subjects to the database first.</p>
        </div>
      )}

      {/* Recent uploads */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-4">Recent Documents</h3>
        {documents && documents.length > 0 ? (
          <div className="space-y-3">
            {documents.map((doc: { id: string; title: string; status: string; created_at: string; subjects?: { name: string } | null }) => (
              <div
                key={doc.id}
                className="flex items-center gap-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 p-4"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{doc.title}</p>
                  {doc.subjects && (
                    <p className="text-xs text-gray-400">{doc.subjects.name}</p>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <Clock className="w-3 h-3 text-gray-500" />
                  <span className="text-gray-400">
                    {new Date(doc.created_at).toLocaleDateString()}
                  </span>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    doc.status === 'ready'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : doc.status === 'processing'
                      ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}
                >
                  {doc.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No documents uploaded yet</p>
        )}
      </div>
    </div>
  )
}
