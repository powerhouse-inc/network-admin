export const getNewDocumentObject = (documentName: string, documentType: string, code?: string, ) => {
    console.log("documentName", documentName);
    console.log("documentType", documentType);
    console.log("code", code);
    if(documentType === "powerhouse/rfp") {
        documentName = documentName.replace(/^RFP-/, "");
    }
    return {
        header: {
            name: documentName,
            documentType: documentType,
            createdAtUtcIso: new Date().toISOString(),
            slug: documentName,
            branch: "main",
            id: "",
            sig: {
                nonce: "",
                publicKey: {},
            },
            revision: {},
            lastModifiedAtUtcIso: new Date().toISOString(),
        },
        history: {
            operations: [],
            clipboard: [],
        },
        state: {
            auth: {},
            document: {
                version: "1.0.0",
            },
            global: {
                title: documentName,
                code: code || "",
                description: "",
                createdBy: "network-admin",
                createdAt: new Date().toISOString(),
                updatedBy: "network-admin",
                updatedAt: new Date().toISOString(),
                status: "draft",
            },
            local: {},
        },
        initialState: {
            auth: {},
            document: {
                version: "1.0.0",
            },
            global: {
                title: documentName,
                code: code || "",
                description: "",
                createdBy: "network-admin",
                createdAt: new Date().toISOString(),
                updatedBy: "network-admin",
                updatedAt: new Date().toISOString(),
                status: "draft",
            },
            local: {},
        },
        operations: {
            [documentType]: [],
        },
        clipboard: [],
        attachments: {},
    }
}