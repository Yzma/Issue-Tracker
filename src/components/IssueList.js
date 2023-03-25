import React from 'react';
import Issue from './IssueContainer';


const IssueList = ({ issues, routePath }) => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3/4"> {/* Add container div with styling */}
      <div className="bg-white shadow-md rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Label
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Updated
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {issues.map((issue, index) => (
              <Issue key={index} issue={issue} routePath={routePath} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IssueList;
