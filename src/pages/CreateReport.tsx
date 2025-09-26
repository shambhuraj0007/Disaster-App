import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, MapPin, Save, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useReportStore } from '@/store/useReportStore';

const reportSchema = z.object({
  hazardType: z.enum(['tsunami', 'cyclone', 'earthquake', 'flood', 'landslide'], {
    required_error: 'Please select a hazard type',
  }),
  severity: z.enum(['low', 'medium', 'high', 'critical'], {
    required_error: 'Please select severity level',
  }),
  location: z.string().min(1, 'Location is required'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description must be less than 1000 characters'),
});

type ReportFormData = z.infer<typeof reportSchema>;

const hazardTypes = [
  { value: 'tsunami', label: 'Tsunami', icon: '🌊', color: 'bg-blue-100 text-blue-800' },
  { value: 'cyclone', label: 'Cyclone', icon: '🌀', color: 'bg-purple-100 text-purple-800' },
  { value: 'earthquake', label: 'Earthquake', icon: '🏗️', color: 'bg-orange-100 text-orange-800' },
  { value: 'flood', label: 'Flood', icon: '💧', color: 'bg-blue-100 text-blue-800' },
  { value: 'landslide', label: 'Landslide', icon: '⛰️', color: 'bg-amber-100 text-amber-800' },
];

const severityLevels = [
  { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
  { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800' },
];

export default function CreateReport() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addReport } = useReportStore();
  const [step, setStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);

  const form = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      description: '',
      location: '',
    },
  });

  const onSubmit = async (data: ReportFormData) => {
    try {
      const newReport = {
        id: Date.now().toString(),
        userId: 'current-user', // This would come from auth
        hazardType: data.hazardType,
        severity: data.severity,
        description: data.description,
        location: {
          lat: currentLocation?.lat || 20.5937,
          lng: currentLocation?.lng || 78.9629,
          address: data.location,
        },
        media: uploadedFiles.map(file => URL.createObjectURL(file)),
        timestamp: new Date(),
        status: 'submitted' as const,
      };

      addReport(newReport);
      toast({
        title: 'Report Submitted',
        description: 'Your hazard report has been submitted successfully.',
      });
      navigate('/reports');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit report. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          toast({
            title: 'Location captured',
            description: 'Your current location has been recorded.',
          });
        },
        (error) => {
          toast({
            title: 'Location Error',
            description: 'Could not get your current location.',
            variant: 'destructive',
          });
        }
      );
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files].slice(0, 5)); // Max 5 files
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Create Hazard Report</h1>
          <p className="text-muted-foreground">Report a natural hazard in your area</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`flex items-center ${
                  stepNumber < 3 ? 'flex-1' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNumber
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      step > stepNumber ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span>Hazard Type</span>
            <span>Details</span>
            <span>Review</span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Hazard Type Selection */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Select Hazard Type</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="hazardType"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {hazardTypes.map((hazard) => (
                            <div
                              key={hazard.value}
                              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                field.value === hazard.value
                                  ? 'border-primary bg-primary/5'
                                  : 'border-border hover:border-primary/50'
                              }`}
                              onClick={() => field.onChange(hazard.value)}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{hazard.icon}</span>
                                <div>
                                  <p className="font-medium">{hazard.label}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="severity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Severity Level</FormLabel>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {severityLevels.map((severity) => (
                            <div
                              key={severity.value}
                              className={`p-3 border rounded-lg cursor-pointer text-center transition-all ${
                                field.value === severity.value
                                  ? 'border-primary bg-primary/5'
                                  : 'border-border hover:border-primary/50'
                              }`}
                              onClick={() => field.onChange(severity.value)}
                            >
                              <Badge className={severity.color} variant="secondary">
                                {severity.label}
                              </Badge>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={() => setStep(2)}
                      disabled={!form.watch('hazardType') || !form.watch('severity')}
                    >
                      Next
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Location and Details */}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Location and Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input placeholder="Enter location or address" {...field} />
                          </FormControl>
                          <Button type="button" variant="outline" onClick={getCurrentLocation}>
                            <MapPin className="h-4 w-4" />
                          </Button>
                        </div>
                        {currentLocation && (
                          <FormDescription>
                            GPS coordinates captured: {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
                          </FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the hazard situation in detail..."
                            className="min-h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {field.value?.length || 0}/1000 characters
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Media Upload */}
                  <div>
                    <Label>Photos/Videos (Optional)</Label>
                    <div className="mt-2 space-y-3">
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" className="flex-1" asChild>
                          <label>
                            <Camera className="h-4 w-4 mr-2" />
                            Take Photo
                            <input
                              type="file"
                              accept="image/*"
                              capture="environment"
                              className="hidden"
                              onChange={handleFileUpload}
                            />
                          </label>
                        </Button>
                        <Button type="button" variant="outline" className="flex-1" asChild>
                          <label>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Files
                            <input
                              type="file"
                              accept="image/*,video/*"
                              multiple
                              className="hidden"
                              onChange={handleFileUpload}
                            />
                          </label>
                        </Button>
                      </div>

                      {uploadedFiles.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {uploadedFiles.map((file, index) => (
                            <div key={index} className="relative">
                              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                                {file.type.startsWith('image/') ? (
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt="Upload preview"
                                    className="w-full h-full object-cover rounded-lg"
                                  />
                                ) : (
                                  <div className="text-center">
                                    <Upload className="h-8 w-8 mx-auto mb-1" />
                                    <p className="text-xs">{file.name}</p>
                                  </div>
                                )}
                              </div>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                                onClick={() => removeFile(index)}
                              >
                                ×
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setStep(1)}>
                      Back
                    </Button>
                    <Button type="button" onClick={() => setStep(3)}>
                      Review
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Review and Submit */}
            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Review Your Report</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <Label>Hazard Type</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-2xl">
                          {hazardTypes.find(h => h.value === form.watch('hazardType'))?.icon}
                        </span>
                        <span className="font-medium">
                          {hazardTypes.find(h => h.value === form.watch('hazardType'))?.label}
                        </span>
                        <Badge className={severityLevels.find(s => s.value === form.watch('severity'))?.color}>
                          {form.watch('severity')}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <Label>Location</Label>
                      <p className="mt-1">{form.watch('location')}</p>
                    </div>

                    <div>
                      <Label>Description</Label>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {form.watch('description')}
                      </p>
                    </div>

                    {uploadedFiles.length > 0 && (
                      <div>
                        <Label>Attachments</Label>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {uploadedFiles.length} file(s) attached
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setStep(2)}>
                      Back
                    </Button>
                    <Button type="button" variant="outline" className="flex-1">
                      <Save className="h-4 w-4 mr-2" />
                      Save Draft
                    </Button>
                    <Button type="submit" className="flex-1">
                      <Send className="h-4 w-4 mr-2" />
                      Submit Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}