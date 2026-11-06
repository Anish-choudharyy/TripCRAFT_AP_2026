import React, { useState, useEffect } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Download,
  Database,
  Layers,
  ArrowRight,
  FileText,
  RefreshCw,
} from 'lucide-react';
import { api } from '../services/api';

export default function DataHubPage() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [auditResult, setAuditResult] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [health, setHealth] = useState(null);
  const [loadingLogs, setLoadingLogs] = useState(false);

  const fetchStatus = async () => {
    try {
      const h = await api.getHealth();
      setHealth(h);
      const logs = await api.getAuditLogs();
      setAuditLogs(logs);
    } catch (err) {
      console.warn('Status fetch error:', err);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setAuditResult(null);
    try {
      const res = await api.importDestinationsCSV(file);
      setAuditResult(res);
      setFile(null);
      fetchStatus();
    } catch (err) {
      alert('CSV Processing Error: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleExportCSV = () => {
    window.open('http://127.0.0.1:5001/api/data/export-trips-csv', '_blank');
  };

  return (
    <div className="pt-24 pb-28 min-h-screen bg-[#0B0F14] text-[#E7EDF5]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#2A3644] pb-8 mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#73DACA] font-semibold mb-2">
              <span className="w-2 h-0.5 bg-[#73DACA]" />
              <span>ADVANCED PROGRAMMING & DATA ENGINEERING</span>
            </div>
            <h1 className="font-condensed text-4xl sm:text-6xl font-bold uppercase text-[#E7EDF5] tracking-tight">
              DATA PIPELINE & ETL HUB
            </h1>
            <p className="text-[#94A3B8] text-sm font-light mt-1 max-w-xl">
              Automated ingestion, data sanitization, schema validation, and PostgreSQL relational persistence.
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-sm bg-[#202B38] border border-[#2A3644] hover:border-[#73DACA] text-xs uppercase tracking-[0.2em] font-bold text-[#E7EDF5] hover:text-[#73DACA] transition-colors cursor-pointer self-start md:self-auto"
          >
            <Download className="w-4 h-4 text-[#73DACA]" />
            <span>Export Trips to CSV</span>
          </button>
        </div>

        {/* Database & Pipeline Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-5 rounded bg-[#131B24] border border-[#2A3644]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono uppercase text-[#94A3B8]">Database Engine</span>
              <Database className="w-4 h-4 text-[#73DACA]" />
            </div>
            <div className="font-condensed text-2xl font-bold text-[#E7EDF5]">
              {health?.postgresActive ? 'PostgreSQL 16' : 'In-Memory / Postgres-Ready'}
            </div>
            <div className="text-[11px] text-[#73DACA] mt-1 font-mono">
              {health?.postgresActive ? 'Live Connection Pool Active' : 'Fallback Store Enabled (Set .env for Postgres)'}
            </div>
          </div>

          <div className="p-5 rounded bg-[#131B24] border border-[#2A3644]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono uppercase text-[#94A3B8]">ETL Transformations</span>
              <RefreshCw className="w-4 h-4 text-[#73DACA]" />
            </div>
            <div className="font-condensed text-2xl font-bold text-[#E7EDF5]">
              Clean & Validate
            </div>
            <div className="text-[11px] text-[#94A3B8] mt-1 font-mono">
              Currency parsing, Slug generation, Category normalization
            </div>
          </div>

          <div className="p-5 rounded bg-[#131B24] border border-[#2A3644]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono uppercase text-[#94A3B8]">Relational Schemas</span>
              <Layers className="w-4 h-4 text-[#73DACA]" />
            </div>
            <div className="font-condensed text-2xl font-bold text-[#E7EDF5]">
              5 Tables Configured
            </div>
            <div className="text-[11px] text-[#94A3B8] mt-1 font-mono">
              destinations, trips, itinerary, expenses, audit
            </div>
          </div>
        </div>

        {/* CSV Ingestion Pipeline Card */}
        <div className="bg-[#131B24] border border-[#2A3644] rounded-sm p-6 sm:p-8 mb-12">
          <div className="flex items-center gap-2 mb-2">
            <UploadCloud className="w-5 h-5 text-[#73DACA]" />
            <h3 className="font-condensed text-2xl font-bold uppercase text-[#E7EDF5]">
              BULK DESTINATION INGESTION PIPELINE (CSV)
            </h3>
          </div>
          <p className="text-xs text-[#94A3B8] font-light max-w-2xl mb-6">
            Upload raw destination datasets. The automated Data Engineering pipeline strips dirty currency formatting, repairs inconsistent categories, generates unique indexed slugs, and performs atomic upserts into PostgreSQL.
          </p>

          <form onSubmit={handleUpload} className="space-y-6">
            <div className="border-2 border-dashed border-[#2A3644] hover:border-[#73DACA]/60 rounded-sm p-8 text-center transition-colors">
              <input
                type="file"
                accept=".csv"
                id="csv-upload"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="csv-upload" className="cursor-pointer flex flex-col items-center">
                <FileSpreadsheet className="w-10 h-10 text-[#73DACA] mb-3" />
                <span className="text-sm font-semibold text-[#E7EDF5] mb-1">
                  {file ? file.name : 'Choose a destination CSV file or drop here'}
                </span>
                <span className="text-xs text-[#94A3B8]">
                  {file
                    ? `Size: ${(file.size / 1024).toFixed(1)} KB — Ready to transform`
                    : 'A sample file is available at server/data/sample_destinations.csv'}
                </span>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs text-[#94A3B8] font-mono">
                Supported columns: Destination, State, Category, Budget, highlights, best_season, duration
              </div>

              <button
                type="submit"
                disabled={!file || uploading}
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-sm text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${
                  !file || uploading
                    ? 'bg-[#202B38] text-[#94A3B8] cursor-not-allowed'
                    : 'bg-[#73DACA] text-[#0B0F14] hover:bg-[#9AEBDD]'
                }`}
              >
                {uploading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing ETL Pipeline...</span>
                  </>
                ) : (
                  <>
                    <span>Run Data Transformation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* ETL Audit Execution Result */}
          {auditResult && (
            <div className="mt-8 p-5 rounded bg-[#1a232e] border border-[#73DACA]/50 animate-fadeIn">
              <div className="flex items-center gap-2 text-xs font-bold text-[#73DACA] uppercase tracking-wider mb-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>ETL Execution Succeeded</span>
              </div>
              <p className="text-xs text-[#E7EDF5] mb-4">{auditResult.message}</p>

              <div className="grid grid-cols-3 gap-3 font-mono text-xs mb-4">
                <div className="p-3 bg-[#131B24] rounded border border-[#2A3644]">
                  <span className="block text-[#94A3B8] text-[10px]">TOTAL SCANNED</span>
                  <span className="text-lg font-bold text-[#E7EDF5]">{auditResult.audit.totalRows}</span>
                </div>
                <div className="p-3 bg-[#131B24] rounded border border-[#2A3644]">
                  <span className="block text-[#94A3B8] text-[10px]">SUCCESSFULLY UPSERTED</span>
                  <span className="text-lg font-bold text-[#73DACA]">{auditResult.audit.validRows}</span>
                </div>
                <div className="p-3 bg-[#131B24] rounded border border-[#2A3644]">
                  <span className="block text-[#94A3B8] text-[10px]">REJECTED / MALFORMED</span>
                  <span className="text-lg font-bold text-rose-400">{auditResult.audit.rejectedRows}</span>
                </div>
              </div>

              {auditResult.audit.transformations.length > 0 && (
                <div className="border-t border-[#2A3644] pt-3">
                  <span className="block text-[11px] font-mono text-[#94A3B8] uppercase mb-2">
                    Cleaning & Sanitization Audit:
                  </span>
                  <ul className="space-y-1 text-xs font-mono text-[#94A3B8]">
                    {auditResult.audit.transformations.map((t, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-[#73DACA]">Row {t.row} ({t.name}):</span>
                        <span>{t.fixes ? t.fixes.join(' | ') : t.reasons.join(' | ')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Database Schema Reference */}
        <div className="bg-[#131B24] border border-[#2A3644] rounded-sm p-6 sm:p-8">
          <h3 className="font-condensed text-xl font-bold uppercase text-[#E7EDF5] mb-4">
            POSTGRESQL RELATIONAL ENTITY SPECIFICATION
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-4 rounded bg-[#202B38]/60 border border-[#2A3644]">
              <span className="text-[#73DACA] font-bold block mb-1">TABLE: destinations</span>
              <ul className="text-[#94A3B8] space-y-0.5 text-[11px]">
                <li>• id SERIAL PRIMARY KEY</li>
                <li>• slug VARCHAR UNIQUE</li>
                <li>• name, state VARCHAR</li>
                <li>• category VARCHAR</li>
                <li>• budget_inr INTEGER</li>
                <li>• highlights JSONB</li>
              </ul>
            </div>

            <div className="p-4 rounded bg-[#202B38]/60 border border-[#2A3644]">
              <span className="text-[#73DACA] font-bold block mb-1">TABLE: trips</span>
              <ul className="text-[#94A3B8] space-y-0.5 text-[11px]">
                <li>• id SERIAL PRIMARY KEY</li>
                <li>• title, destination VARCHAR</li>
                <li>• start_date, end_date DATE</li>
                <li>• budget NUMERIC(12,2)</li>
                <li>• status VARCHAR</li>
                <li>• travelers VARCHAR</li>
              </ul>
            </div>

            <div className="p-4 rounded bg-[#202B38]/60 border border-[#2A3644]">
              <span className="text-[#73DACA] font-bold block mb-1">TABLE: itinerary_items</span>
              <ul className="text-[#94A3B8] space-y-0.5 text-[11px]">
                <li>• id SERIAL PRIMARY KEY</li>
                <li>• trip_id FK &rarr; trips(id)</li>
                <li>• day_number INTEGER</li>
                <li>• time_slot VARCHAR</li>
                <li>• cost NUMERIC(10,2)</li>
                <li>• completed BOOLEAN</li>
              </ul>
            </div>

            <div className="p-4 rounded bg-[#202B38]/60 border border-[#2A3644]">
              <span className="text-[#73DACA] font-bold block mb-1">TABLE: expenses</span>
              <ul className="text-[#94A3B8] space-y-0.5 text-[11px]">
                <li>• id SERIAL PRIMARY KEY</li>
                <li>• trip_id FK &rarr; trips(id)</li>
                <li>• title, category VARCHAR</li>
                <li>• amount NUMERIC(10,2)</li>
                <li>• payment_method VARCHAR</li>
                <li>• date DATE</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
