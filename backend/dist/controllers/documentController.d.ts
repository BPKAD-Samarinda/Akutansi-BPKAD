import { Request, Response } from 'express';
export declare const getAllDocuments: (req: Request, res: Response) => Promise<void>;
export declare const createDocument: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateDocument: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteDocument: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=documentController.d.ts.map