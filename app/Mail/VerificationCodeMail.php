<?php

declare(strict_types=1);

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class VerificationCodeMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public string $verificationCode;

    /**
     * Tạo mới một instance của mail
     * @param string $verificationCode
     */
    public function __construct(string $verificationCode)
    {
        $this->verificationCode = $verificationCode;
    }

    /**
     * Lấy envelope của mail
     * @return Envelope
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Mã xác thực email - ' . config('app.name'),
        );
    }

    /**
     * Lấy nội dung của mail
     * @return Content
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.verification-code',
            with: [
                'verificationCode' => $this->verificationCode,
                'appName' => config('app.name'),
                'expiresIn' => 15, // 15 phút
            ],
        );
    }

    /**
     * Lấy các attachments của mail
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
