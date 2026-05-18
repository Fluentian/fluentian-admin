'use client';

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Download, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import apiClient from "@/lib/api/client";
import { toast } from "sonner";

export default function CurriculumImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setResults(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await apiClient.post("/content/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResults(data);
      toast.success("Import completed successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Import failed");
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    const headers = "level,type,title,code,parent_code,kind,sequence_no,estimated_minutes,xp,payload,grading_payload\n";
    const examples = [
      // Course
      "0,course,French A1,FR_A1,,core,1,300,100,{},",
      // Unit
      "1,unit,Greetings & Basics,FR_A1_U1,FR_A1,core,1,,,{:},",
      // Lesson
      "2,lesson,Introducing Yourself,FR_A1_U1_L1,FR_A1_U1,vocabulary,1,10,20,{:},",
      // Blocks
      "3,block,Intro Text,B1,FR_A1_U1_L1,text,1,,,{\"text\": \"In this lesson, we will learn how to say hello.\"},",
      "3,block,Audio Example,B2,FR_A1_U1_L1,audio,2,,,{\"url\": \"https://example.com/hello.mp3\", \"caption\": \"Listen to the pronunciation\"},",
      // Questions
      "4,question,Translate Hello,Q1,FR_A1_U1_L1,translation,1,,,{\"text\": \"Hello\"},{\"answer\": \"Bonjour\"}",
      "4,question,Greeting MCQ,Q2,FR_A1_U1_L1,mcq_single,2,,,{\"question\": \"Which of these is a greeting?\", \"options\": [\"Bonjour\", \"Pain\", \"Livre\"]},{\"correct_index\": 0}"
    ].join("\n");
    
    const blob = new Blob([headers + examples], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fluentian_curriculum_template.csv';
    a.click();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      <PageHeader 
        title="Curriculum Import" 
        description="Bulk upload courses, units, lessons, and questions using a CSV spreadsheet."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Upload Card */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-[16px] flex items-center gap-2">
                <Upload size={18} className="text-primary" />
                Upload Spreadsheet
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div 
                className="border-2 border-dashed border-gray-100 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer relative"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <input 
                  id="file-upload" 
                  type="file" 
                  accept=".csv" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
                <FileText size={40} className="text-primary/40 mb-4" />
                <p className="text-[14px] font-medium text-text-primary">
                  {file ? file.name : "Click to select or drag CSV file"}
                </p>
                <p className="text-[12px] text-text-muted mt-1">
                  CSV format only • Max 10MB
                </p>
              </div>

              <Button 
                className="w-full h-12 gap-2" 
                disabled={!file || isUploading}
                onClick={handleUpload}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Processing Curriculum...
                  </>
                ) : (
                  <>
                    <Upload size={18} />
                    Start Import
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results Summary */}
          {results && (
            <Card className="border-none shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CardHeader>
                <CardTitle className="text-[16px] flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-success" />
                  Import Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                  <ResultStat label="Courses" value={results.courses} />
                  <ResultStat label="Units" value={results.units} />
                  <ResultStat label="Lessons" value={results.lessons} />
                  <ResultStat label="Blocks" value={results.blocks} />
                  <ResultStat label="Questions" value={results.questions} />
                </div>

                {results.errors.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-[14px] font-bold text-danger flex items-center gap-2">
                      <AlertCircle size={16} />
                      Encountered Issues ({results.errors.length})
                    </h4>
                    <div className="bg-danger/5 border border-danger/10 rounded-lg p-4 max-h-[300px] overflow-y-auto">
                      {results.errors.map((err: string, i: number) => (
                        <div key={i} className="text-[12px] text-danger/80 py-1 border-b border-danger/5 last:border-0">
                          {err}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Data Reference Guide */}
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-gray-50/50">
              <CardTitle className="text-[16px] flex items-center gap-2">
                <AlertCircle size={18} className="text-primary" />
                Mandatory Field Reference
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-[13px]">
                  <thead className="bg-gray-50 border-y border-gray-100">
                    <tr>
                      <th className="text-left px-6 py-3 font-semibold text-text-muted">Type</th>
                      <th className="text-left px-6 py-3 font-semibold text-text-muted">Valid 'kind' Values</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    <ReferenceRow type="Unit" values={['core', 'practice', 'story', 'checkpoint']} />
                    <ReferenceRow type="Lesson" values={['grammar_explainer', 'dialogue', 'vocabulary', 'pronunciation', 'listening', 'reading', 'writing', 'speaking']} />
                    <ReferenceRow type="Block" values={['text', 'audio', 'image', 'video', 'markdown']} />
                    <ReferenceRow type="Question" values={['mcq_single', 'mcq_multi', 'fill_blank', 'match_pairs', 'translation']} />
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Template Card */}
          <Card className="border-none shadow-sm bg-primary text-white">
            <CardHeader>
              <CardTitle className="text-[16px] flex items-center gap-2">
                <Download size={18} />
                Get Template
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-[13px] text-white/80">
                Download the detailed CSV template with pre-filled examples for all content types.
              </p>
              <Button 
                variant="secondary" 
                className="w-full gap-2 text-[13px] bg-white text-primary hover:bg-white/90" 
                onClick={downloadTemplate}
              >
                <Download size={14} />
                Download CSV Template
              </Button>
            </CardContent>
          </Card>

          {/* Documentation Links */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-[16px] flex items-center gap-2">
                <FileText size={18} className="text-primary" />
                Payload Examples
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-[12px] font-bold text-text-primary uppercase mb-2">MCQ Payload</p>
                <pre className="text-[10px] bg-gray-50 p-3 rounded-lg overflow-x-auto text-text-secondary">
                  {`{"question": "How are you?", \n "options": ["Bien", "Chat", "Rouge"]}`}
                </pre>
              </div>
              <div>
                <p className="text-[12px] font-bold text-text-primary uppercase mb-2">Translation Payload</p>
                <pre className="text-[10px] bg-gray-50 p-3 rounded-lg overflow-x-auto text-text-secondary">
                  {`{"text": "Hello, how are you?"}`}
                </pre>
              </div>
              <p className="text-[11px] text-text-muted italic bg-warning/5 p-3 rounded-lg border border-warning/10">
                Tip: Use valid JSON strings in the 'payload' and 'grading_payload' columns. Avoid using single quotes within JSON strings.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ReferenceRow({ type, values }: { type: string, values: string[] }) {
  return (
    <tr>
      <td className="px-6 py-4 font-bold text-text-primary">{type}</td>
      <td className="px-6 py-4 flex flex-wrap gap-2">
        {values.map(v => (
          <span key={v} className="bg-primary/5 text-primary px-2 py-0.5 rounded text-[11px] border border-primary/10">
            {v}
          </span>
        ))}
      </td>
    </tr>
  );
}

function ResultStat({ label, value }: { label: string, value: number }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 text-center">
      <p className="text-[11px] text-text-muted uppercase font-bold tracking-wider mb-1">{label}</p>
      <p className="text-[24px] font-bold text-text-primary">{value}</p>
    </div>
  );
}
