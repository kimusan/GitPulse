import React from 'react';
import { Download, Package, Calendar, ExternalLink, HardDrive } from 'lucide-react';
import { GitHubRelease } from '../../types/github';

interface ReleasesTableProps {
  releases: GitHubRelease[];
}

export const ReleasesTable: React.FC<ReleasesTableProps> = ({ releases }) => {
  if (!releases || releases.length === 0) {
    return (
      <div className="py-8 text-center text-gh-muted text-sm bg-gh-card/30 rounded-xl border border-gh-border/50">
        <Package size={32} className="mx-auto mb-2 opacity-50" />
        No published releases found for this repository
      </div>
    );
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      {releases.map(rel => {
        const releaseDate = new Date(rel.published_at || rel.created_at).toLocaleDateString(
          'en-US',
          { year: 'numeric', month: 'short', day: 'numeric' }
        );

        return (
          <div
            key={rel.id}
            className="bg-gh-surface border border-gh-border rounded-2xl p-4 sm:p-5 overflow-hidden shadow-sm"
          >
            {/* Release Header */}
            <div className="flex items-start justify-between gap-3 flex-wrap border-b border-gh-border/50 pb-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gh-green/15 text-gh-green border border-gh-green/30">
                    {rel.tag_name}
                  </span>
                  <h4 className="text-sm sm:text-base font-semibold text-gh-text">
                    {rel.name || rel.tag_name}
                  </h4>
                </div>
                <div className="flex items-center gap-4 text-xs text-gh-muted mt-1.5">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} /> {releaseDate}
                  </span>
                  <span className="flex items-center gap-1 text-gh-green font-medium">
                    <Download size={12} /> {rel.total_download_count?.toLocaleString() || 0} total downloads
                  </span>
                </div>
              </div>

              <a
                href={rel.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gh-blue hover:underline flex items-center gap-1 font-medium"
              >
                View on GitHub <ExternalLink size={12} />
              </a>
            </div>

            {/* Assets Download Table */}
            {rel.assets && rel.assets.length > 0 ? (
              <div className="mt-4">
                <h5 className="text-xs font-semibold text-gh-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <HardDrive size={13} className="text-gh-blue" />
                  Release Assets ({rel.assets.length})
                </h5>
                <div className="overflow-x-auto rounded-xl border border-gh-border/40">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gh-card/60 text-gh-muted font-medium border-b border-gh-border/40">
                      <tr>
                        <th className="py-2.5 px-3">Asset File</th>
                        <th className="py-2.5 px-3">Size</th>
                        <th className="py-2.5 px-3">Downloads</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gh-border/20">
                      {rel.assets.map(asset => (
                        <tr key={asset.id} className="hover:bg-gh-card/40 transition-colors">
                          <td className="py-2.5 px-3 font-mono font-medium text-gh-text max-w-xs truncate">
                            {asset.name}
                          </td>
                          <td className="py-2.5 px-3 text-gh-muted">
                            {formatFileSize(asset.size)}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-gh-green">
                            {asset.download_count.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <a
                              href={asset.browser_download_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-gh-blue/15 hover:bg-gh-blue text-gh-blue hover:text-white rounded-lg transition-colors font-medium text-[11px]"
                            >
                              <Download size={11} /> Download
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gh-muted mt-3 italic">
                No direct binary assets attached to this tag.
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};
